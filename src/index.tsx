/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language, rosetty, RosettyReturn } from 'rosetty';
import {
  Accessor,
  children,
  createContext,
  createMemo,
  createSignal,
  JSX,
  useContext,
} from 'solid-js';

export const RosettyContext = createContext();

export const RosettyProvider = (props: {
  children: JSX.Element;
  languages: Record<string, Language>;
  defaultLanguage: string;
  translateFallback?: boolean;
}) => {
  const r = createMemo(
    () =>
      rosetty(props.languages, props.defaultLanguage, props.translateFallback),
    [props.languages]
  );
  const c = children(() => props.children);
  const [actualLang, setActualLang] = createSignal(props.defaultLanguage);

  const providerReturn = {
    ...r(),
    actualLang,
    changeLang: (lang: string) => {
      r().changeLang(lang);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setActualLang(r().getCurrentLang()!);
    },
  };

  return (
    <RosettyContext.Provider value={providerReturn}>
      {c()}
    </RosettyContext.Provider>
  );
};

type AnyObject = Record<string, any>;

export function useRosetty<T extends AnyObject>(): RosettyReturn<T> & {
  actualLang: Accessor<string | undefined>;
} {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return useContext(RosettyContext);
}

export type Rosetty<T extends AnyObject> = RosettyReturn<T>;
