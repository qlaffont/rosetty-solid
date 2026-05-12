import { type Language, rosetty, type RosettyReturn } from 'rosetty';
import type { Context, JSX } from 'solid-js';
import {
  Accessor,
  createComponent,
  createContext,
  createMemo,
  createSignal,
  useContext,
} from 'solid-js';

type AnyObject = Record<string, unknown>;

/** Avoid TS2589 from recursive ObjectDotNotation inference on dictionary types. */
const bootstrapRosetty = rosetty as (
  languages: Record<string, Language>,
  defaultLang?: string,
  translateFallback?: boolean
) => RosettyReturn<any>;

type RosettyClientAccessor = Accessor<any>;

export const RosettyContext: Context<RosettyClientAccessor | undefined> =
  createContext<RosettyClientAccessor | undefined>();

export const RosettyProvider = (props: {
  children: JSX.Element;
  languages: Record<string, Language>;
  defaultLanguage: string;
  translateFallback?: boolean;
}) => {
  const [r, setLastR] = createSignal(
    bootstrapRosetty(
      props.languages,
      props.defaultLanguage,
      props.translateFallback
    ),
    { equals: false }
  );

  const [actualLang, setActualLang] = createSignal(props.defaultLanguage);

  const changeLang = (lang: string) => {
    r().changeLang(lang);
    setActualLang(r().getCurrentLang()!);
    setLastR(r() as any);
  };

  const returnValue = createMemo(() => ({
    ...r(),
    actualLang,
    changeLang,
  }));

  return createComponent(RosettyContext.Provider, {
    get value() {
      return returnValue;
    },
    get children() {
      return props.children;
    },
  }) as JSX.Element;
};

export function useRosetty<T extends AnyObject>(): Accessor<
  RosettyReturn<T> & {
    actualLang: Accessor<string | undefined>;
  }
> {
  const client = useContext(RosettyContext);

  if (!client) {
    throw new Error('No RosettyClient set, use RosettyProvider to set one');
  }

  return client as unknown as Accessor<
    RosettyReturn<T> & {
      actualLang: Accessor<string | undefined>;
    }
  >;
}

export type Rosetty<T extends AnyObject> = RosettyReturn<T>;
