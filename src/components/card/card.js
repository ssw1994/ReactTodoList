import React from "react";
import "./card.css";
import * as moment from "moment";
import db from "../../db";
import channel from "../../channel";
import * as $ from "jquery";
const status = {
    New: 1,
    Active: 2,
    Completed: 3,
    OnHold: 4
}
export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todo: this.props.todo,
            priorities: [
                { valueName: 'Select', value: '' },
                { valueName: 'High', value: 1 },
                { valueName: 'Medium', value: 2 },
                { valueName: 'Low', value: 3 }
            ],

            status: [
                { valueName: 'Select', value: '' },
                { valueName: 'New', value: 1 },
                { valueName: 'Active', value: 2 },
                { valueName: 'Completed', value: 3 },
                { valueName: 'OnHold', value: 4 }
            ]
        };
        if (this.state.todo) {
            if (this.state.todo.todoStatus == status.Active) {
                this.handleTimer(null, 'start');
            }
        }
        setInterval(this.blink_text, 1000);
    }


    blink_text() {
        $('.blink').fadeOut(500);
        $('.blink').fadeIn(500);
    }

    handleTimer(event, option) {
        try {
            this.forceUpdate();
            event && event.stopPropagation();
            switch (option) {
                case 'start':
                    let todo = Object.assign({}, this.state.todo);
                    let date = moment(new Date());
                    date.hours(parseInt(todo.todoETA.HH));
                    date.minutes(parseInt(todo.todoETA.MM));
                    this.interval = setInterval(() => {
                        todo.todoETA = {
                            HH: date.hours(),
                            MM: date.minutes()
                        }
                        if (todo.todoETA.HH == 0 && todo.todoETA.MM == 0) {
                            this.handleTimer(null, 'stop');
                        } else {
                            date.minutes(date.minutes() - 1);
                        }
                        db.updateDB('tbltodo', todo).then(
                            (success) => {
                                console.log(success.message);
                                this.setState({ todo: todo });
                            },
                            (error) => {
                                console.error(error.message);
                            }
                        );
                    }, (1000 * 60));
                    break;
                case 'stop':
                    clearInterval(this.interval);
                    break;
            }
        } catch (error) {
            console.error(error);
        }
    }

    deleteTodo(event) {
        try {
            db.deleteDB('tbltodo', this.state.todo.id).then(
                (success) => {
                    console.log(success.message)
                    channel.dbObserver.next(true);
                },
                (error) => {
                    console.error(error.message)
                }
            )
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @author SSW
     * @description this function is used for completing todo
     * @param {*} event 
     */
    completeTodo(event) {
        try {
            event && event.stopPropagation();
            let todo = Object.assign({}, this.state.todo);
            todo.todoStatus = status.Completed;
            let index = this.state.status.findIndex((x) => x.value == todo.todoStatus);
            if (index >= 0)
                todo.status = this.state.status[index].valueName;

            db.updateDB('tbltodo', todo).then(
                (success) => {
                    console.log(success.message);
                    this.setState({ todo: todo });
                    this.handleTimer(null, 'stop');
                },
                (error) => {
                    console.error(error.message);
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    editTodo(event) {
        try {
            event && event.stopPropagation();
            channel.editObserver.next(Object.assign({}, this.state.todo));
        } catch (error) {
            console.error(error);
        }
    }

    handleAction(event, action) {
        try {
            event && event.stopPropagation();
            let todo, index;
            switch (action) {
                case 'start':
                    todo = Object.assign({}, this.state.todo);
                    todo.todoStatus = status.Active;
                    index = this.state.status.findIndex((x) => x.value == todo.todoStatus);
                    if (index >= 0)
                        todo.status = this.state.status[index].valueName;
                    console.log(todo);
                    db.updateDB('tbltodo', todo).then(
                        (success) => {
                            this.setState({ todo: todo });
                            if (this.state.todo.todoStatus == status.Active) {
                                this.handleTimer(null, action);
                            } else {
                                this.handleTimer(null, 'stop');
                            }
                            console.log(success.message);
                        },
                        (error) => {
                            console.error(error.message);
                        }
                    )
                    break;
                case 'stop':
                    todo = Object.assign({}, this.state.todo);
                    todo.todoStatus = status.OnHold;
                    index = this.state.status.findIndex((x) => x.value == todo.todoStatus);
                    if (index >= 0)
                        todo.status = this.state.status[index].valueName;

                    db.updateDB('tbltodo', todo).then(
                        (success) => {
                            this.handleTimer(null, 'stop');
                            this.setState({ todo: todo });
                            console.log(success.message);
                            //channel.dbObserver.next(true);
                        },
                        (error) => {
                            console.error(error.message);
                        }
                    )
                    this.handleTimer(null, 'stop');
                    break;
            }
        } catch (error) {
            console.error(error);
        }
    }

    componentWillUnmount() {
        try {
            clearInterval(this.state.interval);
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <div className="col-md-12 col-sm-12 col-xs-12 todo-card">
                <div className="todo-title">{this.state.todo.todoTitle}</div>
                <div className="todo-date"><span><i className="fa fa-calendar-check-o fa-lg" aria-hidden="true"></i></span>{this.state.todo.todoDate}</div>
                <div className="todo-priority">
                    {/* {this.state.todo.priority} */}
                    <div className="tp">
                        {
                            this.state.priorities.map((x) => {
                                return <div>
                                    {x.value == this.state.todo.todoPriority ?
                                        <div>
                                            <div className={this.state.todo.todoPriority == 1 ? 'red check' : (this.state.todo.todoPriority == 2 ? "green" : "blue") + " check"}>
                                            </div>
                                            <div className="p-val">{x.valueName}</div>
                                        </div> : ""
                                    }
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="todo-status">
                    <div className="tp">
                        {
                            this.state.status.map((x) => {
                                return <div>
                                    {x.value == this.state.todo.todoStatus ?
                                        <div>
                                            <div className={this.state.todo.todoStatus == 1 ? "new check" : (this.state.todo.todoStatus == 2 ? "active check" : (this.state.todo.todoStatus == 3 ? "blue check" : "black check"))}>
                                            </div>
                                            <div className="p-val">{x.valueName}</div>
                                        </div> : ""
                                    }
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="todo-ETA">
                    <span><i className="fa fa-clock-o fa-lg" aria-hidden="true"></i></span>
                    <span className={this.state.todo.todoStatus == 2 && this.state.todo.todoETA && this.state.todo.todoETA.HH == 0 && this.state.todo.todoETA.MM == 0 ? 'red-timer ' + (this.state.todo.todoStatus == 2 ? "blink" : null) : 'green-timer ' + (this.state.todo.todoStatus == 2 ? "blink" : null)}>{this.state.todo && this.state.todo.todoETA ?
                        this.state.todo.todoETA.HH + " HH :  " + this.state.todo.todoETA.MM + " MM" : ""}
                    </span>
                </div>
                <div className="todo-actions">
                    <span className="btns">
                        {this.state.todo.todoStatus != 3 ? <span onClick={(e) => this.editTodo(e)}><i className="fa fa-pencil fa-lg" title="Edit"></i></span> : null}
                        {this.state.todo.todoStatus != 2 ? <span onClick={(e) => this.deleteTodo(e)}><i className="fa fa-trash-o fa-lg" title="Delete"></i></span> : null}
                        {this.state.todo.todoStatus == 1 || this.state.todo.todoStatus == 4 ? <span onClick={(e) => this.handleAction(e, 'start')}><i className="fa fa-play fa-lg" title="start"></i></span> : null}
                        {this.state.todo.todoStatus == 2 ? <span onClick={(e) => this.handleAction(e, 'stop')}><i className="fa fa-pause fa-lg" title="stop"></i></span> : null}
                        {this.state.todo.todoStatus == 2 ? <span onClick={(e) => this.completeTodo(e)}><i className="fa fa-check fa-lg" aria-hidden="true"></i></span> : null}
                    </span>
                </div>

            </div>
        )
    }
}