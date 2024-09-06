import path from 'path';
import fs from "fs";

export function getTranslations(locale, namespace = 'common') {
  const filePath = path.resolve(`./public/locales/${locale}.json`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

