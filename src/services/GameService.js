import axios from "axios";

export class GameService{
    _http;
    constructor() {
        this._http = axios.create({
            baseURL: "http://localhost:3000/results",
            headers: {'X-Custom-Header': 'foobar'}
        })
    }
    async getResults(){
        return this._http.get()
    }
}