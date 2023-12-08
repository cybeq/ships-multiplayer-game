export default class {
    service =undefined;
    constructor(service) {
        this.service = service
    }
    api = undefined;
    data = [
        {
            id: "3123",
        },
    ];
    columns = [
        {
            headerName: "PLAYER_1",
            field: "playerA",
            flex: 1,
        },
        {
            headerName: "PLAYER_2",
            field: "playerB",
            flex: 1,
        },
        {
            headerName: "WINNER",
            field: "winner",
            flex: 1,
        },
    ];

    options = {
        onGridReady: (params) => {
            this.api = params.api;
            this.service.getResults().then(results=>{
                if(results?.data.length>0){
                    this.api?.setRowData(results.data);
                }
            })
        },
    };
}
