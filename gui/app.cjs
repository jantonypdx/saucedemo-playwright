const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const Store = require('electron-store');
const tmp = require('tmp');
const commands = require('./commands.cjs');
const dotenv = require('dotenv');

const parentDirectory = path.join(__dirname, '..');
const store = new Store();

// load additional environment variables from .env file
dotenv.config({
  path: process.env.CONFIGPATH || 'config/.env',
  override: false
});

// define variables from datastore or default if doesnt exist yet
let loglevel = store.get('loglevel') || 'verbose';
let visible = store.get('visible');
if (visible === undefined) {
  visible = false;
}
let chromium = store.get('chromium');
if (chromium === undefined) {
  chromium = true;
}
let firefox = store.get('firefox');
if (firefox === undefined) {
  firefox = false;
}
let mobileChromium = store.get('mobileChromium');
if (mobileChromium === undefined) {
  mobileChromium = false;
}
let webkit = store.get('webkit');
if (webkit === undefined) {
  webkit = false;
}
let mobileWebkit = store.get('mobileWebkit');
if (mobileWebkit === undefined) {
  mobileWebkit = false;
}
let codebase = store.get('codebase') || 'X1';
let instance = store.get('instance') || 'PRD';
let fixture = store.get('fixture') || 'saucedemo.spec.mjs';
let testcase = store.get('testcase') || 'user can login to website';
let report = store.get('report') || 'text';

// get HTML elements for buttons
const visibleCheckbox = document.getElementById('visible');
const chromiumCheckbox = document.getElementById('chromium');
const firefoxCheckbox = document.getElementById('firefox');
const mobileChromiumCheckbox = document.getElementById('mobileChromium');
const webkitCheckbox = document.getElementById('webkit');
const mobileWebkitCheckbox = document.getElementById('mobileWebkit');
const runTestButton = document.getElementById('runTestButton');
const commandLineElement = document.getElementById('commandLine');
const copyCommandLineElement = document.getElementById('copyCommandLine');
const siteElement = document.getElementById('site');
const fixtureSelector = document.getElementById('fixtureSelector');
const testcaseSelector = document.getElementById('testcaseSelector');

// note - getElemementsByName() fxn returns a NodeList collection. Using the
// spread operator, we can convert it to an array, which can then later be
// used to simply map click handlers. (see below)
const loglevelRadioButtons = [...document.getElementsByName('loglevel')];
const reportRadioButtons = [...document.getElementsByName('report')];

/**
 * function that updates the test command in the "Command Line" text area
 */
function updateSiteAndCommand() {
  let specificTest = '';

  if (testcase.length && testcase !== 'all testcases') {
    specificTest += `--grep="${testcase}"`;
  }

  const site = process.env.SITE || 'https://www.saucedemo.com/';

  siteElement.textContent = site;

  let command = '';
  if (process.platform === 'darwin') {
    let leadingVariables = '';

    if (visibleCheckbox.checked) {
      leadingVariables += `HEADLESS=false `;
    } else {
      leadingVariables += `HEADLESS=true `;
    }

    leadingVariables += `LOGLEVEL=${loglevel}`;

    command = `${leadingVariables} npx playwright test ${fixture} ${specificTest}`;

    if (chromiumCheckbox.checked) {
      command += ' --project=chromium';
    }
    if (firefoxCheckbox.checked) {
      command += ' --project=firefox';
    }
    if (mobileChromiumCheckbox.checked) {
      command += ' --project=mobile-chromium';
    }
    if (webkitCheckbox.checked) {
      command += ' --project=webkit';
    }
    if (mobileWebkitCheckbox.checked) {
      command += ' --project=mobile-webkit';
    }

    if (report === 'playwright-html') {
      command += ' --reporter=list,html; npx playwright show-report';
    } else if (report === 'monocart-html') {
      command +=
        ' --reporter=list,monocart-reporter; npx monocart show-report monocart-report/index.html';
    }
  } else if (process.platform === 'win32') {
    let leadingVariables = '';

    if (visibleCheckbox.checked) {
      leadingVariables += `set "HEADLESS=false" && `;
    } else {
      leadingVariables += `set "HEADLESS=true" && `;
    }

    leadingVariables += `set "LOGLEVEL=${loglevel}" &&`;

    command = `${leadingVariables} npx playwright test ${fixture} ${specificTest}`;

    if (chromiumCheckbox.checked) {
      command += ' --project=chromium';
    }
    if (firefoxCheckbox.checked) {
      command += ' --project=firefox';
    }
    if (mobileChromiumCheckbox.checked) {
      command += ' --project=mobile-chromium';
    }
    if (webkitCheckbox.checked) {
      command += ' --project=webkit';
    }
    if (mobileWebkitCheckbox.checked) {
      command += ' --project=mobile-webkit';
    }

    if (report === 'playwright-html') {
      command += ' --reporter=list,html; npx playwright show-report';
    } else if (report === 'monocart-html') {
      command +=
        ' --reporter=list,monocart-reporter; npx monocart show-report monocart-report/index.html';
    }
  }
  commandLineElement.textContent = command;
}

/**
 * Handler for button click events
 * @param { event } event
 * @param { string } type
 */
const clickHandler = (event, type) => {
  switch (type) {
    case 'loglevel':
      loglevel = event.target.value;
      console.log(`loglevel:`, loglevel);
      store.set('loglevel', loglevel);
      break;
    case 'report':
      report = event.target.value;
      console.log(`report:`, report);
      store.set('report', report);
      break;

    default:
  }
  updateSiteAndCommand();
};

// -- Setup button click handlers ----------------------------------------

// update visible checkbox
visibleCheckbox.addEventListener('change', () => {
  visible = !visible;
  store.set('visible', visible);
  updateSiteAndCommand();
});

// update chromium checkbox
chromiumCheckbox.addEventListener('change', () => {
  chromium = !chromium;
  store.set('chromium', chromium);
  updateSiteAndCommand();
});

// update firefox checkbox
firefoxCheckbox.addEventListener('change', () => {
  firefox = !firefox;
  store.set('firefox', firefox);
  updateSiteAndCommand();
});

// update mobileChromium checkbox
mobileChromiumCheckbox.addEventListener('change', () => {
  mobileChromium = !mobileChromium;
  store.set('mobileChromium', mobileChromium);
  updateSiteAndCommand();
});

// update webkit checkbox
webkitCheckbox.addEventListener('change', () => {
  webkit = !webkit;
  store.set('webkit', webkit);
  updateSiteAndCommand();
});

// update mobileWebkit checkbox
mobileWebkitCheckbox.addEventListener('change', () => {
  mobileWebkit = !mobileWebkit;
  store.set('mobileWebkit', mobileWebkit);
  updateSiteAndCommand();
});

// setup click handlers for "loglevel" radio buttons
loglevelRadioButtons.map((button) =>
  button.addEventListener('click', (event) => clickHandler(event, 'loglevel'))
);

// setup click handlers for "Report" radio buttons
reportRadioButtons.map((button) =>
  button.addEventListener('click', (event) => clickHandler(event, 'report'))
);

// ---------------------------------------------------

// setup handler for "Fixture" dropdown selector
fixtureSelector.addEventListener('change', (event) => {
  fixture = event.target.value;
  store.set('fixture', fixture);

  // find matching fixure
  const command = commands.find((cmd) => cmd.fixture === fixture);

  // choose first testcase
  [testcase] = command.testCases;
  store.set('testcase', testcase);

  // refresh displayed testcases
  testcaseSelector.options.length = 0;
  command.testCases.forEach((testCase) => {
    const option = document.createElement('option');
    option.value = testCase;
    option.text = testCase;
    testcaseSelector.appendChild(option);
  });

  console.log(`fixture: ${fixture}`);
  updateSiteAndCommand();
});

// ---------------------------------------------------

// setup handler for "TestCase" dropdown selector
testcaseSelector.addEventListener('change', (event) => {
  testcase = event.target.value;
  store.set('testcase', testcase);
  if (testcase.match(/all testcases/i)) {
    testcase = '';
  }

  console.log(`testcase: ${testcase}`);
  updateSiteAndCommand();
});

// ---------------------------------------------------
// setup handler for Command Line copy button (copies
// command line text to clipboard)
copyCommandLineElement.addEventListener('click', () => {
  commandLineElement.select();
  document.execCommand('copy');
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }

  console.log('CommandLine copied to clipboard');
});

// ---------------------------------------------------
// setup handler for "Run Test" button
runTestButton.addEventListener('click', () => {
  console.log('button: "Run Test" clicked');

  // write the test script
  let testRunnerCommands = '';

  if (process.platform === 'darwin') {
    testRunnerCommands =
      `cd ${parentDirectory}\n` +
      `echo '> ${commandLineElement.textContent}'\n` +
      `${commandLineElement.textContent}\n` +
      `echo ""\n` +
      `read -p "Press return to exit "\n` +
      `rm -- "$0"\n`; // tells the script to delete itself
  } else if (process.platform === 'win32') {
    testRunnerCommands =
      `cd ${parentDirectory}\n` +
      `call ${commandLineElement.textContent}\n` +
      `pause\n` +
      `call del "%~f0" && exit\n`;
  }

  // get the correct shell extension if mac or window system
  let shellExt = '.sh';
  if (process.platform === 'win32') {
    shellExt = '.bat';
  }

  // create an executable temporary "test runner" file
  // e.g. "testRunner-xxxxxx.sh"
  const tempFileOptions = {
    prefix: 'testRunner-',
    postfix: shellExt
  };

  // if (process.platform !== 'win32') {
  tempFileOptions.mode = '0755'; // give +x attribute
  // }

  const testRunnerFile = tmp.fileSync(tempFileOptions);

  fs.writeFileSync(testRunnerFile.name, testRunnerCommands, 'utf8');

  // open the terminal & run the test script
  if (process.platform === 'darwin') {
    spawn('open', ['-a', 'Terminal', testRunnerFile.name]);
  } else if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', 'Playwright runner', testRunnerFile.name], {
      cwd: parentDirectory
    });
  }
});

/**
 * Set defaults values from store or default
 */
function initAppPreferences() {
  visibleCheckbox.checked = visible;
  chromiumCheckbox.checked = chromium;
  firefoxCheckbox.checked = firefox;
  mobileChromiumCheckbox.checked = mobileChromium;
  webkitCheckbox.checked = webkit;
  mobileWebkitCheckbox.checked = mobileWebkit;

  loglevelRadioButtons.forEach((option) => {
    if (option.value === loglevel) {
      option.checked = 'checked';
    }
  });

  reportRadioButtons.forEach((option) => {
    if (option.value === report) {
      option.checked = 'checked';
    }
  });
}

// update data on page after DOM is loaded
// after app start, set all default values
document.addEventListener('DOMContentLoaded', () => {
  // add test detail values based on stored preferences
  initAppPreferences();

  // add fixtures
  commands
    .sort((a, b) => a.fixture.localeCompare(b.fixture))
    .forEach((command) => {
      const option = document.createElement('option');
      option.value = command.fixture;
      option.text = command.fixture;
      fixtureSelector.appendChild(option);
    });

  choices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  choices.forEach((choice) => {
    const option = document.createElement('option');
    option.value = choice;
    option.text = choice;
  });

  choices = [0, 1, 2, 3];
  choices.forEach((choice) => {
    const option = document.createElement('option');
    option.value = choice;
    option.text = choice;
  });

  // fetch the stored fixture, or default 'saucedemo.spec.mjs' command
  const fixtureCommand = commands.find((cmd) => cmd.fixture === fixture);

  // set the GUI's starting fixture to previously stored fixture, or default 'saucedemo.spec.mjs' fixture
  fixtureSelector.value = fixtureCommand.fixture;

  // set the GUI's starting testcases to stored fixture testcases, or default 'saucedemo.spec.mjs' testcases
  fixtureCommand.testCases.forEach((testCase) => {
    const option = document.createElement('option');
    option.value = testCase;
    option.text = testCase;
    testcaseSelector.appendChild(option);
    if (option.text === testcase) {
      option.setAttribute('selected', true);
    }
  });

  fixture = fixtureCommand.fixture;

  updateSiteAndCommand();
});
