import React from "react";
import Card from "../card/card";
import db from "../../db";
import channel from "../../channel";
export default class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            todoList: []
        };
        setTimeout(() => {
            this.getTodoList();
        }, 2000);

        channel.dbObserver.subscribe((res)=>{
            //setTimeout(() => {
                this.getTodoList();
            //}, 2000);    
        });
    }

    getTodoList() {
        try {
            // db.getData('tbltodo').then(
            //     (success)=>{
            //         this.setState({todoList:success});
            //     },
            //     (error)=>{
            //         console.error(error);
            //     }
            // )
            db.getData('tbltodo').then(
                (result) => {
                    console.log(result);
                    this.setState({ todoList: result});
                },
                (error) => {
                    console.error(error);
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <div className="row">
                {   
                    this.state.todoList.filter((x)=>!this.props.search || x.todoTitle.toLowerCase().includes(this.props.search.toLowerCase())).map((item) => {
                        return (<div className="col-md-2 col-sm-3 col-xs-12" style={{'padding':'0','margin':'10px'}}>
                            <Card todo={item} key={Math.random()}/>
                        </div>)
                    })
                }
            </div>
        );
    }
}