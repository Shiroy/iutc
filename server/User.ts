/// <reference path="typings/tsd.d.ts" />

import io = require("socket.io");

export class User
{
    private _login: string;
    private _nom: string;
    private _prenom: string;

    private _session: SocketIO.Client;

    constructor(login: string, nom: string, prenom:string, session: SocketIO.Client) {
        this._login = login;
        this._nom = nom;
        this._prenom = prenom;
        this._session = session;
    }

    get login(): string {
        return this._login;
    }

    get nom(): string{
        return this._nom;
    }

    get prenom(): string{
        return this._prenom;
    }
    
    get session(): SocketIO.Client {
        return this._session;
    }
}
