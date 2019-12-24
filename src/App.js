import React from 'react';
import './App.css';
import Todo from "./components/todo/todo";
import List from "./components/list/list";
import db from "./db";
import channel from "./channel";
import * as $ from "jquery";
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showTodo: false,
      formData: null,
      search: "",
      sortOptions: { sortby: "", sortOrder: "ASC" }
    };

    this.sortby = [
      { valueName: "Todotitle", value: "todoTitle" },
      { valueName: 'Date', value: "todoDate" },
      { valueName: "Priority", value: "todoPriority" },
      { valueName: "Status", value: "todoStatus" }
    ]

    this.handleChange = this.handleChange.bind(this);
    this.handleSort = this.handleSort.bind(this);

    channel.editObserver.subscribe((data) => {
      console.log(data);
      if (!this.state.showTodo)
        this.toggleTodo(null, data);
    })
  }

  changeBK() {
    try {
      let max = 4, min = 1;
      let currentImage = Math.floor(Math.random() * (max - min) + min);
      $('.content').css('background-image', 'url(./background_' + currentImage + '.jpg)');
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    try {
      //setInterval(this.changeBK, 5000);
    } catch (error) {
      console.error(error);
    }
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

  /**
   * @author SSW
   * @description this function is used for handling sorting
   * @param {*} event 
   */
  handleSort(event) {
    try {
      let target = event.target;
      let name = target.name;
      let state = Object.assign({}, this.state);
      state.sortOptions.sortby = target.value;
      this.setState(state);
      console.log(target.value, name)
      channel.sortObserver.next(this.state.sortOptions);
    } catch (error) {
      console.error(error);
    }
  }

  changeOrder(event) {
    try {
      let state = Object.assign({}, this.state);
      state.sortOptions.sortOrder == 'ASC' ? state.sortOptions.sortOrder = 'DSC' : state.sortOptions.sortOrder = 'ASC';
      this.setState(state);
      channel.sortObserver.next(this.state.sortOptions);
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
          <div className="Search_box row">
            <div className="col-md-8 col-sm-8 col-xs-12">
              <div className="input-group md-form form-sm form-2 pl-0">
                <input className="form-control my-0 py-1 lime-border" type="text" placeholder="Search Todo..." aria-label="Search" value={this.state.search} onChange={this.handleChange} />
                <div className="input-group-append">
                  <span className="input-group-text lime lighten-2" id="basic-text1"><i className="fa fa-search text-grey"
                    aria-hidden="true"></i></span>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-sm-2 col-xs-6">
              <select className="form-control" name="sortby" value={this.state.sortOptions.sortby} onChange={this.handleSort}>
                <option value="">Sort By</option>
                {
                  this.sortby.map((x) => {
                    return <option value={x.value}>{x.valueName}</option>
                  })
                }
              </select>
            </div>
            <div className="col-md-1 col-sm-1 col-xs-6">
              <button className="btn btn-primary" onClick={(e) => this.changeOrder(e)}>{this.state.sortOptions.sortOrder}</button>
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
              <List search={this.state.search} />
            </div>
          </div>
        </div>
        <button className="btn btn-primary fab-btn" onClick={(e) => this.toggleTodo(e)}>{!this.state.showTodo ? '+' : 'x'}</button>
      </div>
    );
  }
}

export default App;
