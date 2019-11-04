import React from "react";
import "./todo.css";
import * as moment from "moment";
import db from "../../db";
import channel from "../../channel";
export default class Todo extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            formData: props.data ? props.data : {
                todoTitle: props.data && props.data.todoTitle ? props.data.todoTitle : "",
                todoDate: props.data && props.data.todoDate ? props.data.todoDate : null,
                todoPriority: props.data && props.data.todoPriority ? props.data.todoPriority : "",
                todoStatus: props.data && props.data.todoStatus ? props.data.todoStatus : "",
                todoETA: props.data && props.data.todoETA ? props.data.todoETA : { HH: "", MM: "" },
            },

            formErrors: {
                todoTitle: false,
                todoDate: false,
                todoPriority: false,
                todoStatus: false,
                todoETA: {
                    HH: false,
                    MM: false
                },
                valid: false
            },

            // other variables

            priorities: [
                { valueName: 'High', value: 1 },
                { valueName: 'Medium', value: 2 },
                { valueName: 'Low', value: 3 }
            ],

            status: [
                { valueName: 'New', value: 1 },
                { valueName: 'Active', value: 2 },
                { valueName: 'Completed', value: 3 },
                { valueName: 'OnHold', value: 4 }
            ],
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        try {
            this.validateTodo();
        } catch (error) {
            console.error(error);
        }
    }


    validateTodo() {
        try {
            let formErrors = { valid: true };
            Object.keys(this.state.formData).forEach((x) => {
                switch (x) {
                    case "todoTitle":
                        if (!this.state.formData.todoTitle) {
                            formErrors[x] = false;
                            formErrors['valid'] = false;
                        }
                        else
                            formErrors[x] = true;
                        break;
                    case "todoDate":
                        if (!this.state.formData.todoDate) {
                            formErrors[x] = false;
                        } else {
                            if (this.state.formData.todoDate && moment(new Date()).isAfter(moment(this.state.formData.todoDate))) {
                                formErrors[x] = false;
                                formErrors['valid'] = false;
                            } else {
                                formErrors[x] = true;
                            }
                        }
                        break;
                    case "todoPriority":
                        if (!this.state.formData.todoPriority) {
                            formErrors[x] = false;
                            formErrors['valid'] = false;
                        }
                        else
                            formErrors[x] = true;
                        break;
                    case "todoStatus":
                        if (!this.state.formData.todoStatus) {
                            formErrors[x] = false;
                            formErrors['valid'] = false;
                        }
                        else
                            formErrors[x] = true;
                        break;
                    case "todoETA":
                        formErrors[x] = {};
                        Object.keys(this.state.formData.todoETA).forEach((y) => {
                            switch (y) {
                                case "HH":
                                    if (!this.state.formData.todoETA || (this.state.formData.todoETA && (this.state.formData.todoETA.HH < 0 || this.state.formData.todoETA.HH > 23)) || (this.state.formData.todoETA.HH == "" || this.state.formData.todoETA.HH == undefined || this.state.formData.todoETA.HH == null)) {
                                        formErrors[x][y] = false;
                                        formErrors['valid'] = false;
                                    }
                                    else
                                        formErrors[x][y] = true;
                                    break;
                                case "MM":
                                    if (!this.state.formData.todoETA || (this.state.formData.todoETA && (this.state.formData.todoETA.MM < 0 || this.state.formData.todoETA.MM > 59)) || (this.state.formData.todoETA.MM == "" || this.state.formData.todoETA.MM == undefined || this.state.formData.todoETA.MM == null)) {
                                        formErrors[x][y] = false;
                                        formErrors['valid'] = false;
                                    }
                                    else
                                        formErrors[x][y] = true;
                                    break;
                            }
                        });
                        break;
                }
            });
            this.setState({ formErrors: formErrors });
            console.log(this.state);
        } catch (error) {
            console.error(error);
        }
    }

    updateTodo(e) {
        try {
            console.log(this.state);
            db.updateDB("tbltodo", this.state.formData).then(
                (success) => {
                    console.log(success);
                    this.props.toggle(null);
                    channel.dbObserver.next(true);
                },
                (error) => {
                    console.error(error);
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @author SSW
     * @descriptor this function is used for handling input value changes
     * @param {*} e 
     */
    handleChange(e) {
        try {
            e.persist();
            const target = e.target;
            const name = target.name;
            console.log(e);
            let obj = {};
            if (name === 'todoStatus' || name === 'todoPriority') {
                if (name === 'todoStatus') {
                    let index = this.state.status.findIndex((x) => x.value == target.value);
                    if (index >= 0)
                        obj['status'] = this.state.status[index].valueName;
                }

                if (name === 'todoPriority') {
                    let index = this.state.priorities.findIndex((x) => x.value == target.value);
                    if (index >= 0)
                        obj['priority'] = this.state.priorities[index].valueName;
                }
            }
            if (name === 'HH' || name === 'MM') {
                let todoETA = {};
                if (name === 'HH') {
                    todoETA['MM'] = this.state.formData.todoETA.MM;
                    todoETA['HH'] = target.value;
                }
                else {
                    todoETA['HH'] = this.state.formData.todoETA.HH;
                    todoETA['MM'] = target.value;
                }

                this.setState({
                    formData: Object.assign(this.state.formData, { todoETA: todoETA })
                }, () => { this.validateTodo() });
                console.log(this.state.formData);
            } else {
                obj = Object.assign(obj, {
                    [name]: target.value
                });
                this.setState({
                    formData: Object.assign(this.state.formData, obj)
                }, () => { this.validateTodo() });
                console.log(this.state.formData);
            }
        } catch (error) {
            console.error(error);
        }
    }


    render() {
        return (
            <div className="col-md-12 col-sm-12 col-xs-12 todo-box">
                <div className="col-md-12 col-sm-12 col-xs-12 todo-heading">
                    <span>{!this.state.formData.id ? "Add Todo" : "Edit Todo"}</span>
                    <span onClick={(e) => this.props.toggle(e)} style={{ "float": "right", "cursor": "pointer" }}><i className="fa fa-close fa-lg"></i></span>
                </div>
                <form>
                    <div className="form-group">
                        <label>Todo Title {this.state.todoTitle}</label>
                        <input className={!this.state.formErrors.todoTitle ? "form-control error" : "form-control"} placeholder="Todo Title" name="todoTitle" value={this.state.formData.todoTitle} onChange={this.handleChange} required></input>
                    </div>
                    <div className="form-group">
                        <label>Todo Date</label>
                        <input className={!this.state.formErrors.todoDate ? "form-control error" : "form-control"} type="date" name="todoDate" value={this.state.formData.todoDate} onChange={this.handleChange} required></input>
                    </div>
                    <div className="form-group">
                        <label>Todo Priority</label>
                        <select className={!this.state.formErrors.todoPriority ? "form-control error" : "form-control"} name="todoPriority" value={this.state.formData.todoPriority} onChange={this.handleChange} required>
                            <option value="">Select</option>
                            {
                                this.state.priorities.map((x) => {
                                    return <option key={x.valueName} value={x.value}>{x.valueName}</option>
                                })
                            }
                        </select>
                        {/* <input className="form-control" value={this.state.todoPriority}></input> */}
                    </div>
                    <div className="form-group">
                        <label>Todo Status</label>
                        <select className={!this.state.formErrors.todoStatus ? "form-control error" : "form-control"} name="todoStatus" value={this.state.formData.todoStatus} onChange={this.handleChange} required>
                            <option value="">Select</option>
                            {
                                this.state.status.map((x) => {
                                    return <option key={x.valueName} value={x.value} >{x.valueName}</option>
                                })
                            }
                        </select>
                        {/* <input className="form-control" value={this.state.todoStatus}></input> */}
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <label>Todo ETA</label>
                        </div>
                        <div></div>
                        <div className="col-md-6 col-sm-6 col-xs-6 p0 form-group">
                            <label>HH</label>
                            <input name="HH" max="23" value={this.state.formData.todoETA.HH} placeholder="HH" className={!this.state.formErrors.todoETA.HH ? "form-control error" : "form-control"} type="number" onChange={this.handleChange} required></input>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-6 p0 form-group">
                            <label>MM</label>
                            <input name="MM" max="59" value={this.state.formData.todoETA.MM} placeholder="MM" className={!this.state.formErrors.todoETA.MM ? "form-control error" : "form-control"} type="number" onChange={this.handleChange} required></input>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-12 col-xs-12 text-center">
                        <button className="btn btn-primary action-button" onClick={(e) => this.updateTodo(e)} type="button" disabled={!this.state.formErrors.valid}>{!this.state.formData.id ? 'Add' : 'Update'}</button>
                        <button className="btn btn-primary action-button" onClick={(e) => this.props.toggle(e)} type="button">Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}