/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { PipelineSource, Pipeline } from '../dist/pipelines';

// Augment the Firestore and Query classes with the pipeline() method.
// This is stripped from dist/lite/pipelines.d.ts during the build
// so it needs to be re-added here.
declare module '@firebase/firestore' {
  interface Firestore {
    pipeline(): PipelineSource<Pipeline>;
  }
}

export * from '../dist/pipelines';
