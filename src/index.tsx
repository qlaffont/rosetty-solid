/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language, rosetty, RosettyReturn } from 'rosetty';
import {
  Accessor,
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const r = createMemo(
    () =>
      rosetty(props.languages, props.defaultLanguage, props.translateFallback),
    []
  );

  const [actualLang, setActualLang] = createSignal(props.defaultLanguage);

  const changeLang = (lang: string) => {
    r().changeLang(lang);
    setActualLang(r().getCurrentLang()!);
  };

  return (
    <RosettyContext.Provider
      value={{
        ...r(),
        actualLang,
        changeLang,
      }}
    >
      {props.children}
    </RosettyContext.Provider>
  );
};

type AnyObject = Record<string, any>;

export function useRosetty<T extends AnyObject>(): RosettyReturn<T> & {
  actualLang: Accessor<string | undefined>;
} {
  const client = useContext(RosettyContext);

  if (!client) {
    throw new Error('No RosettyClient set, use RosettyProvider to set one');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return client;
}

export type Rosetty<T extends AnyObject> = RosettyReturn<T>;
