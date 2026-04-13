/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCES = [
  {
    name: 'Translation API',
    url: 'https://raw.githubusercontent.com/webmachinelearning/translation-api/main/index.bs',
  },
  {
    name: 'Writing Assistance APIs',
    url: 'https://raw.githubusercontent.com/webmachinelearning/writing-assistance-apis/main/index.bs',
  },
  {
    name: 'Prompt API',
    url: 'https://raw.githubusercontent.com/webmachinelearning/prompt-api/main/index.bs',
  },
];

import { syncTemplates } from './install.js';

const SKILL_TEMPLATE_PATH = path.join(__dirname, '../templates/SKILL.md');

async function fetchIDLs() {
  let allIdls = '';

  for (const source of SOURCES) {
    console.log(`Fetching ${source.name}...`);
    try {
      const response = await fetch(source.url);
      if (!response.ok) throw new Error(`Failed to fetch ${source.url}`);
      const text = await response.text();

      // Extract IDL blocks from <pre class="idl"> or <xmp class="idl">
      // Bikeshed files use these tags for IDL
      const idlRegex =
        /<(pre|xmp|div)\s+[^>]*class=["']idl["'][^>]*>([\s\S]*?)<\/\1>/gi;
      let match;
      let sourceIdls = `### ${source.name}\n\n`;
      let found = false;

      while ((match = idlRegex.exec(text)) !== null) {
        const idlContent = match[2].trim();
        if (idlContent) {
          sourceIdls += '```webidl\n' + idlContent + '\n```\n\n';
          found = true;
        }
      }

      if (found) {
        allIdls += sourceIdls;
      } else {
        console.warn(`No IDL found for ${source.name}`);
      }
    } catch (error) {
      console.error(`Error processing ${source.name}:`, error.message);
    }
  }

  if (!allIdls) {
    console.error('No IDLs extracted. Aborting template update.');
    return;
  }

  // Update SKILL.md template
  const skillTemplateContent = fs.readFileSync(SKILL_TEMPLATE_PATH, 'utf8');
  const startMarker = '<!-- BEGIN IDLS -->';
  const endMarker = '<!-- END IDLS -->';

  const startIndex = skillTemplateContent.indexOf(startMarker);
  const endIndex = skillTemplateContent.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found in SKILL.md template.');
    return;
  }

  const updatedSkillContent =
    skillTemplateContent.substring(0, startIndex + startMarker.length) +
    '\n' +
    allIdls +
    skillTemplateContent.substring(endIndex);

  fs.writeFileSync(SKILL_TEMPLATE_PATH, updatedSkillContent);
  console.log('Successfully updated templates/SKILL.md with latest IDLs.');

  // Sync to root using install.js logic
  const packageRoot = path.join(__dirname, '..');
  syncTemplates(packageRoot, true);
}

fetchIDLs();
