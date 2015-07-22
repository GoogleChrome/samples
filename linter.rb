#!/usr/bin/env ruby

# Copyright 2015 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# This is a script to lint one or more files for common errors.
# It's ideal for using as part of a git pre-commit hook; use the following to set up the hook:
#     ln -s -f ../../linter.rb .git/hooks/pre-commit
# It can also be run manually, and takes file names (relative to the git root) as parameters.
# The script checks for the following, and exits with a non-zero status if any condition fails:
# - a successful Jekyll site build
# - for each file, that all boilerplate content has been removed
# - for each file, that the templated version of it under _site/ passes jshint

# We need at least one file name as a parameter.
files = ARGV.clone
if files.length == 0
  files = `git diff --cached --name-only --diff-filter=ACM`.split("\n")
end
fail('No files found in git diff, nor provided as command line parameters.') unless files.length > 0

# Bail out if we can't perform a Jekyll site build.
output = `bundle exec jekyll build`
unless $?.success?
  fail("Unable to perform Jekyll build:\n#{output}")
end

JS_HINT_EXTENSIONS = %w(.html .js)
passed = true

files.each do |file|
  File.foreach(file) do |line|
    # Make sure any boilerplate has been removed, unless we're checking one of the files in the
    # starter directory, or checking this linter.rb file.
    # We need to hardcode linter.rb instead of checking $PROGRAM_NAME, since this code may be run as
    # .git/hooks/pre-commit
    if line.match(/REPLACE_ME|PLACEHOLDER/) and
        !File.absolute_path(file).match(Regexp.new("SAMPLE_STARTING_POINT|linter\.rb"))
      puts("Boilerplate found in #{file}: #{line}")
      passed = false
    end
  end

  # Run jshint on any HTML or JS files that changed, using the fully built _site/ version.
  if JS_HINT_EXTENSIONS.include?(File.extname(file))
    output = `jshint --extract=auto _site/#{file}`
    unless $?.success?
      passed = false
      puts(output)
    end
  end
end

if passed
  puts('All checks passed.')
else
  fail('One or more errors were found.')
end
