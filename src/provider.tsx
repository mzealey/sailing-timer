import type { NavigateOptions } from "react-router-dom";

import { NextUIProvider } from "@nextui-org/system";
import { useHref, useNavigate } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "./store";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ReduxProvider store={store}>
      <NextUIProvider navigate={navigate} useHref={useHref}>
        {children}
      </NextUIProvider>
    </ReduxProvider>
  );
}
