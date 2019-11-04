import React from 'react';
import './App.css';
import Todo from "./components/todo/todo";
import List from "./components/list/list";
import db from "./db";
import channel from "./channel";
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { showTodo: false, formData: null, search: "" };
    this.handleChange = this.handleChange.bind(this);
    channel.editObserver.subscribe((data) => {
      console.log(data);
      if (!this.state.showTodo)
        this.toggleTodo(null, data);
    })
  }

  /**
   * @author SSW
   * @description this function is used for onsearch change
   * @param {*} event 
   */
  handleChange(event) {
    try {
      this.setState({ search: event.target.value });
      console.log(this.state);
    } catch (error) {
      console.error(error);
    }
  }

  toggleTodo(e, data) {
    if (data)
      this.setState({ formData: data });
    else
      this.setState({ formData: null });
    this.setState({ showTodo: !this.state.showTodo });
  }

  render() {
    return (
      <div className="App-header">
        <div className="search-filters">
          <div className="Search_box">
            <div className="input-group md-form form-sm form-2 pl-0">
              <input className="form-control my-0 py-1 lime-border" type="text" placeholder="Search Todo..." aria-label="Search" value={this.state.search} onChange={this.handleChange} />
              <div className="input-group-append">
                <span className="input-group-text lime lighten-2" id="basic-text1"><i className="fa fa-search text-grey"
                  aria-hidden="true"></i></span>
              </div>
            </div>
            {/* <form>
              <input className="form-control" placeholder="Search Todo..." />
              <button></button>
            </form> */}
          </div>
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="row">
            <div className="col-md-3 col-sm-3 col-xs-12">
              {this.state.showTodo ? <Todo toggle={(e) => this.toggleTodo(e)} data={this.state.formData} /> : null}
            </div>
            <div className={this.state.showTodo ? "col-md-9 col-sm-9 col-xs-12 todo-list" : "col-sm-12 col-xs-12 col-xs-12 todo-list"}>
              <List search={this.state.search}/>
            </div>
          </div>
        </div>
        <button className="btn btn-primary fab-btn" onClick={(e) => this.toggleTodo(e)}>{!this.state.showTodo ? '+' : 'x'}</button>
      </div>
    );
  }
}

export default App;
