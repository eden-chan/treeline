import type { inject, injectable, interfaces } from "inversify";
import { Container } from "inversify";
import { IYoutubeService, YoutubeService } from "./youtube/youtubeService";
import { createContext } from "react";
import { useService } from "../App";

export function InjectService<T>(
  serviceIdentifier: interfaces.ServiceIdentifier<T>,
) {
  // biome-ignore lint: used for injecting Inversify dependencies
  return function (target: any, key: string) {
    // @ts-ignore
    inject(serviceIdentifier)(target, key);
    // @ts-ignore
    injectable()(target);
  };
}

export const serviceContextContainer = new Container();
serviceContextContainer
  .bind<IYoutubeService>(IYoutubeService)
  .to(YoutubeService)
  .inSingletonScope();

export type ServiceTypes = {
  [IYoutubeService]: IYoutubeService;
};

export type ServiceType<T> = T extends keyof ServiceTypes
  ? ServiceTypes[T]
  : never;
export type ServiceIdentifier = keyof ServiceTypes;

export const ServicesContext = createContext<{ container: Container | null }>({
  container: serviceContextContainer,
});

// Eager initialization. DONT REMOVE THESE
export function initializeEagerServices() {
  useService(IYoutubeService);
}
