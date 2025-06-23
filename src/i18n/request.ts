import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Dynamically import locale messages
  const [common, header, generic, postItem, editItem, countries] =
    await Promise.all([
      import(`../../locales/${locale}/common.json`).then((m) => m.default),
      import(`../../locales/${locale}/header.json`).then((m) => m.default),
      import(`../../locales/${locale}/form/generic.json`).then(
        (m) => m.default
      ),
      import(`../../locales/${locale}/form/postItem.json`).then(
        (m) => m.default
      ),
      import(`../../locales/${locale}/form/editItem.json`).then(
        (m) => m.default
      ),
      import(`../../locales/${locale}/countries.json`).then((m) => m.default),
    ]);

  const messages = {
    common,
    header,
    form: {
      generic,
      postItem,
      editItem,
    },
    countries,
  };

  return {
    locale,
    messages,
  };
});
