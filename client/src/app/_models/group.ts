export interface Group{
    name:string;
    conenctions:Connection[];
}

interface Connection{
    connectionId:string,
    username:string;
}