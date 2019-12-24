import React from "react";
import Card from "../card/card";
import db from "../../db";
import channel from "../../channel";
export default class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            sorter: null
        };
        setTimeout(() => {
            this.getTodoList();
        }, 2000);

        channel.dbObserver.subscribe((res) => {
            //setTimeout(() => {
            this.getTodoList();
            //}, 2000);    
        });

        channel.sortObserver.subscribe(
            (res) => {
                this.setState({ sorter: res });
            },
            (error) => {
                console.error(error);
            }
        )
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
                    this.setState({ todoList: result });
                },
                (error) => {
                    console.error(error);
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    sortList(a, b) {
        try {
            console.log(this.state.sorter && this.state.sorter.sortby);
            if (this.state.sorter) {
                let A = a[this.state.sorter.sortby].toUpperCase(); // ignore upper and lowercase
                let B = b[this.state.sorter.sortby].toUpperCase(); // ignore upper and lowercase
                if(this.state.sorter && this.state.sorter.sortOrder == 'ASC'){
                    if (A < B) {
                        return -1;
                    }
                    if (A > B) {
                        return 1;
                    }
                }else{
                    if (A > B) {
                        return -1;
                    }
                    if (A < B) {
                        return 1;
                    }
                }
                

                // names must be equal
                return 0;
            } else {
                return 1;
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <div className="row">
                {
                    this.state.todoList.sort((a, b) => { return this.sortList(a, b) }).filter((x) => !this.props.search || x.todoTitle.toLowerCase().includes(this.props.search.toLowerCase())).map((item) => {
                        return (<div className="col-md-2 col-sm-3 col-xs-12" style={{ 'padding': '0', 'margin': '10px' }}>
                            <Card todo={item} key={Math.random()} />
                        </div>)
                    })
                }
            </div>
        );
    }
}