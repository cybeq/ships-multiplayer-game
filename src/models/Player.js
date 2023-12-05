import {GameService} from "@/services/GameService";

export class Player{
    service = undefined;
    constructor() {
        this.service = new GameService();
    }
    id;
    inGame = false;
    setInvitation(){

    }
}