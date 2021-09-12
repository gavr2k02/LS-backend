import express from 'express';

export abstract class CommonRoutesConfig {
  private _app: express.Application;
  private _name: string;

  constructor(app: express.Application, name: string) {
    this._app = app;
    this._name = name;
    this.configureRoutes();
  }

  public get name(): string {
    return this._name;
  }

  protected get app(): express.Application {
    return this._app;
  }

  protected abstract configureRoutes(): express.Application;
}
