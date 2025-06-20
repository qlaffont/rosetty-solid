/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
// Importing the jest testing library
import '@testing-library/jest-dom';

import { cleanup, renderHook } from '@solidjs/testing-library';

import { RosettyContext, RosettyProvider, useRosetty } from '../src';
//@ts-ignore
const I18NContextProvider = (props) => (
  <RosettyProvider
    languages={props.languages}
    defaultLanguage={props.defaultLanguage}
  >
    {props.children}
  </RosettyProvider>
);

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
    //@ts-ignore
    const wrapper = (props) => (
      <I18NContextProvider
        languages={{ fr: { dict: {}, locale: "fr" } }}
        defaultLanguage="fr"
      >
        {props.children}
      </I18NContextProvider>
    );
    const { result } = renderHook(() => useRosetty(), { wrapper });
    expect(result().languages).toStrictEqual(['fr']);
    expect(Object.keys(result())).toMatchSnapshot();
  });

  it('should be able to return error', () => {
    //@ts-ignore
    const wrongWrapperLanguageNotValid = (props) => (
      <I18NContextProvider
        languages={{ fr: { dict: {}, locale: "fr" } }}
        defaultLanguage="en"
      >
        {props.children}
      </I18NContextProvider>
    );

    try {
      renderHook(() => useRosetty(), {
        wrapper: wrongWrapperLanguageNotValid,
      });
    } catch (error) {
      //@ts-ignore
      expect(error.message).toBe('rosetty: language en not found');
    }
  });

  it('should be able to return actualLang', () => {
    //@ts-ignore
    const wrapper = (props) => (
      <I18NContextProvider
        languages={{
          fr: { dict: { toto: 'test' }, locale: "fr" },
          en: { dict: { toto: 'EN' }, locale: "en-GB" },
        }}
        defaultLanguage="en"
      >
        {props.children}
      </I18NContextProvider>
    );

    const { result, cleanup } = renderHook(
      () => useRosetty<{ toto: string }>(),
      { wrapper }
    );

    expect(result().actualLang()).toStrictEqual('en');
    expect(result().t('toto')).toStrictEqual('EN');
    result().changeLang('fr');
    cleanup();
    expect(result().actualLang()).toStrictEqual('fr');
    expect(result().t('toto')).toStrictEqual('test');
    expect(result().t('tutu', {}, { fr: { tutu: 'test2' } })).toStrictEqual(
      'test2'
    );
  });
});
