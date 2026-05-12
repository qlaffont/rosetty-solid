import '@formatjs/intl-durationformat/polyfill.js';

import { afterEach, describe, expect, it } from 'bun:test';
import { createComponent } from 'solid-js';
import type { JSX } from 'solid-js';
import { cleanup, renderHook } from '@solidjs/testing-library';

import type { Language } from 'rosetty';

import { RosettyContext, RosettyProvider, useRosetty } from '../src';

function providerTree(props: {
  children?: JSX.Element;
  languages: Record<string, Language>;
  defaultLanguage: string;
}) {
  return createComponent(RosettyProvider, {
    get languages() {
      return props.languages;
    },
    get defaultLanguage() {
      return props.defaultLanguage;
    },
    get children() {
      return props.children;
    },
  }) as JSX.Element;
}

afterEach(() => {
  cleanup();
});

describe('rosetty solid', () => {
  it('should export useI18n + HOC + context', () => {
    expect(typeof useRosetty).toBe('function');
    expect(typeof RosettyProvider).toBe('function');
    expect(typeof RosettyContext).toBe('object');
  });

  it('should be able to use i18n', () => {
    const wrapper = (props: { children?: JSX.Element }) =>
      providerTree({
        languages: { fr: { dict: {}, locale: 'fr' } },
        defaultLanguage: 'fr',
        get children() {
          return props.children;
        },
      });

    const { result } = renderHook(() => useRosetty(), { wrapper });
    expect(result().languages).toStrictEqual(['fr']);
    expect(Object.keys(result())).toMatchSnapshot();
  });

  it('should be able to return error', () => {
    const wrongWrapperLanguageNotValid = (props: { children?: JSX.Element }) =>
      providerTree({
        languages: { fr: { dict: {}, locale: 'fr' } },
        defaultLanguage: 'en',
        get children() {
          return props.children;
        },
      });

    expect(() =>
      renderHook(() => useRosetty(), {
        wrapper: wrongWrapperLanguageNotValid,
      })
    ).toThrow('rosetty: language en not found');
  });

  it('should be able to return actualLang', () => {
    const wrapper = (props: { children?: JSX.Element }) =>
      providerTree({
        languages: {
          fr: { dict: { toto: 'test' }, locale: 'fr' },
          en: { dict: { toto: 'EN' }, locale: 'en-GB' },
        },
        defaultLanguage: 'en',
        get children() {
          return props.children;
        },
      });

    const { result, cleanup: cleanupHook } = renderHook(
      () => useRosetty<{ toto: string }>(),
      { wrapper }
    );

    expect(result().actualLang()).toStrictEqual('en');
    expect(result().t('toto')).toStrictEqual('EN');
    result().changeLang('fr');
    cleanupHook();
    expect(result().actualLang()).toStrictEqual('fr');
    expect(result().t('toto')).toStrictEqual('test');
    expect(result().t('tutu', {}, { fr: { tutu: 'test2' } })).toStrictEqual(
      'test2'
    );
  });
});
