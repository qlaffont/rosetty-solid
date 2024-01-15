/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language, rosetty, RosettyReturn } from 'rosetty';
import {
  Accessor,
  createContext,
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
  const r = rosetty(
    props.languages,
    props.defaultLanguage,
    props.translateFallback
  );
  const [lastUpdate, setLastUpdate] = createSignal(0);

  const [actualLang, setActualLang] = createSignal(props.defaultLanguage);

  const changeLang = (lang: string) => {
    r.changeLang(lang);
    setActualLang(r.getCurrentLang()!);
    setLastUpdate(Date.now());
  };

  return (
    <RosettyContext.Provider
      value={{
        ...r,
        actualLang,
        changeLang,
        lastUpdate: lastUpdate(),
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
