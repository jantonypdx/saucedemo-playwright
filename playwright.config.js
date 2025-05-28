/** @type {import('@playwright/test').PlaywrightTestConfig} */

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// load additional environment variables from .env file
dotenv.config({
  path: process.env.CONFIGPATH || 'config/.env',
  override: false
});

const baseUse = {
  headless:
    !!process.env.CI || Boolean(JSON.parse(process.env.HEADLESS || 'false')),

  fullyParallel: true,
  contextOptions: {
    httpCredentials: {
      username: process.env.SITE_AUTHENTICATION_USERNAME || '',
      password: process.env.SITE_AUTHENTICATION_PASSWORD || ''
    }
  },
  screenshot: 'only-on-failure',
  actionTimeout: 30000,
  navigationTimeout: 30000,
  bypassCSP: true,
  launchOptions: {
    args: ['--disable-web-security']
  }
};

export default defineConfig({
  workers: 4,
  retries: process.env.CI ? 2 : 0,
  timeout: 3600000,
  reportSlowTests: null, // hide slow test warnings
  reporter: process.env.CI
    ? [
        ['dot'],
        ['html', { open: 'never' }],
        ['./lib/reporter/slackErrorReporter.js']
      ]
    : [['list']],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...baseUse
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        ...baseUse
      }
    },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7'],
        ...baseUse
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        ...baseUse,
        deviceScaleFactor: 1
      }
    },
    {
      name: 'mobile-webkit',
      use: {
        ...devices['iPhone 15'],
        ...baseUse,
        deviceScaleFactor: 1
      }
    }
  ]
});
