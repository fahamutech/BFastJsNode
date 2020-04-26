import {RealTimeAdapter} from "../core/RealTimeAdapter";
import * as io from 'socket.io-client';
import {BFastConfig} from "../conf";
import Socket = SocketIOClient.Socket;

export class SocketController implements RealTimeAdapter {
    public readonly socket: Socket;

    constructor(private readonly eventName: string, onConnect?: Function, onDisconnect?: Function) {
        this.socket = io(BFastConfig.getInstance().getCloudFunctionsUrl('/'), {
            autoConnect: true,
        });
        if (onConnect) this.socket.on('connect', onConnect);
        if (onDisconnect) this.socket.on('disconnect', onDisconnect);
    }

    emit(data: { auth: any; payload: any }): void {
        this.socket.emit(this.eventName, data);
    }

    listener(handler: (event: { auth: any; payload: any }) => any): void {
        this.socket.on(this.eventName, handler);
    }

    close(): void {
        if (this.socket.connected) this.socket.disconnect();
    }

    open(): void {
        if (this.socket.disconnected) this.socket.connect();
    }

}

