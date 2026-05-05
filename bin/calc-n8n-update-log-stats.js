#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const DEFAULT_POST_PATH = path.join(__dirname, '../source/_posts/n8n-update-log.md');
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

function readPostFile(postPath) {
  if (!fs.existsSync(postPath)) {
    throw new Error(`Post file not found: ${postPath}`);
  }
  return fs.readFileSync(postPath, 'utf8');
}

function normalizeDate(value, label) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const normalized = value.trim().replace(' ', 'T');
    const withTimezone = /z$/i.test(normalized) ? normalized : `${normalized}Z`;
    const parsed = new Date(withTimezone);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  throw new Error(`Invalid or missing "${label}" in front matter.`);
}

function formatDateUtc(date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const sec = String(date.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec} UTC`;
}

function formatDuration(ms) {
  const days = Math.floor(ms / DAY_MS);
  const hours = Math.floor((ms % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((ms % HOUR_MS) / MINUTE_MS);
  return `${days}d ${hours}h ${minutes}m`;
}

function stripMarkdown(content) {
  let text = content;

  text = text.replace(/```[\s\S]*?```/g, ' ');
  text = text.replace(/\{%[\s\S]*?%\}/g, ' ');
  text = text.replace(/\{\{[\s\S]*?\}\}/g, ' ');
  text = text.replace(/!\[[^\]]*]\([^)]*\)/g, ' ');
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  text = text.replace(/`([^`]*)`/g, '$1');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, '');
  text = text.replace(/^\s*[-*+]\s+/gm, '');
  text = text.replace(/^\s*\d+\.\s+/gm, '');
  text = text.replace(/[*_~]/g, '');
  text = text.replace(/https?:\/\/\S+/g, ' ');

  return text;
}

function extractHeadingDates(headings) {
  const dates = [];
  for (const heading of headings) {
    const match = heading.match(/\b(\d{4}-\d{2}-\d{2})\b/);
    if (!match) {
      continue;
    }
    const parsed = new Date(`${match[1]}T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime())) {
      dates.push(parsed);
    }
  }
  return dates.sort((a, b) => a - b);
}

function main() {
  const inputArg = process.argv[2];
  const postPath = inputArg ? path.resolve(process.cwd(), inputArg) : DEFAULT_POST_PATH;
  const raw = readPostFile(postPath);
  const { data, content } = matter(raw);

  const startDate = normalizeDate(data.date, 'date');
  const endDate = data.modified ? normalizeDate(data.modified, 'modified') : new Date();
  const durationMs = endDate - startDate;
  if (durationMs < 0) {
    throw new Error('"modified" is earlier than "date".');
  }

  const h2Headings = [...content.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
  const headingDates = extractHeadingDates(h2Headings);

  const plainText = stripMarkdown(content);
  const totalVisibleChars = plainText.replace(/\s+/g, '').length;
  const totalAlphaNumChars = (plainText.match(/[\p{L}\p{N}]/gu) || []).length;

  console.log('n8n-update-log stats');
  console.log(`post_path: ${postPath}`);
  console.log(`start_date: ${formatDateUtc(startDate)}`);
  console.log(`end_date: ${formatDateUtc(endDate)}`);
  console.log(`writing_duration: ${formatDuration(durationMs)}`);
  console.log(`post_files: 1`);
  console.log(`update_sections_h2: ${h2Headings.length}`);
  console.log(`dated_update_sections_h2: ${headingDates.length}`);
  if (headingDates.length > 0) {
    console.log(`first_heading_date: ${formatDateUtc(headingDates[0])}`);
    console.log(`last_heading_date: ${formatDateUtc(headingDates[headingDates.length - 1])}`);
  }
  console.log(`total_visible_chars_no_whitespace: ${totalVisibleChars}`);
  console.log(`total_alnum_chars: ${totalAlphaNumChars}`);
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
