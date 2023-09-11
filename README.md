[![Maintainability](https://api.codeclimate.com/v1/badges/82e2c932c7dde770cdd4/maintainability)](https://codeclimate.com/github/qlaffont/rosetty-solid/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/82e2c932c7dde770cdd4/test_coverage)](https://codeclimate.com/github/qlaffont/rosetty-solid/test_coverage) ![npm](https://img.shields.io/npm/v/rosetty-solid) ![npm](https://img.shields.io/npm/dm/rosetty-solid) ![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/rosetty-solid) ![NPM](https://img.shields.io/npm/l/rosetty-solid)

# Rosetty solid

Complete Intl/I18n solution for Solid based on [Rosetty](https://github.com/qlaffont/rosetty)

## Usage

```js
//In your app.js file, add the following code:

import { RosettyProvider } from 'rosetty-solid';
import fr from 'dayjs/locale/fr';

const locales = { fr: { dict: {}, locale: fr } };
const defaultLanguage = 'fr';

const App = ({ children }) => (
  <RosettyProvider locales={locales} defaultLanguage={defaultLanguage}>
    {children}
  </RosettyProvider>
);

module.exports = App;

//In your components file, add the following code:

import { useRosetty } from 'rosetty-solid';

const Home = () => {
  const { t } = useRosetty();
  return <h1>{t('home')}</h1>;
};

module.exports = Home;

```

## API

### RosettyProvider

**Options**

| Field Name      | Type                     | Description                                                    |
| --------------- | ------------------------ | -------------------------------------------------------------- |
| locales         | Record<string, Language> | Specify dictionnary and locale to use for each lang            |
| defaultLanguage | string?                  | Specify default language to use (should be the same as config) |

Return: Rosetty Context HOC + {actualLang: string} who contain your current language

Return a component who instantiate the Rosetty Context.

### WARNING FOR LOCALE !

**You need to import locale from `dayjs` package.**

```js
const fr = require('dayjs/locale/fr');
```

## Maintain

This package use [TSdx](https://github.com/jaredpalmer/tsdx). Please check documentation to update this package.
