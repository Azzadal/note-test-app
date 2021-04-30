import React from 'react';
import './App.css';
import './modal.css';
import Time from './Time';
import Modal from './Modal';
import axios from "axios";
import { Client } from '@stomp/stompjs';
import Moment from 'react-moment';

const SOCKET_URL = 'ws://localhost:8090/websocket';

class App extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			id : 0,
            clientConnected: false,
            messages: '',
			error: null,
			isLoaded: false,
			items: [],
            user: "",
		}
	}

    updateInput(key, value) {
        this.setState({
            [key] : value
        })
    }

    componentDidMount() {
        let onConnected = () => {
            console.log("Connected!!")
            client.subscribe('/topic/test', function (msg) {
                if (msg.body) {
                    const jsonBody = JSON.parse(msg.body);
                    if (jsonBody.message) {
                        alert(jsonBody.message)
                    }
                }
            });
        }

        let onDisconnected = () => {
            console.log("Disconnected!!")
        }

        const client = new Client({
            brokerURL: SOCKET_URL,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: onConnected,
            onDisconnect: onDisconnected
        });

        client.activate();
    }

    login(){
        axios.post('http://localhost:8090/login', {name: this.state.user})
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

	render(){
        return (
            <div>
                <input
                    className="text-input"
                    type="text"
                    placeholder="Введите логин"
                    onChange={(e) => this.updateInput("user", e.target.value)}
                />
                <button
                    className="btn-login btn"
                    onClick={() => this.login()}
                >
                    Войти
                </button>

                <Note user={this.state.user}/>
                <Output user={this.state.user} link={`http://localhost:8090/notes/${this.state.user}`} />
                <div className="divTime">
                    <Time />
                </div>
            </div>
        );
	}
}

class Output extends React.Component{
    constructor(props) {
        super(props);
        this.handleShowModalChange = this.handleShowModalChange.bind(this);
        this.state = {
            id : 0,
            items: [],
            heading: "",
            show: false,
            showModal: false,
        }
    }

    handleShowModalChange() {
        setTimeout(() => this.setState({showModal: false}), 1000)
        this.getNotes()
    }

    getNotes(){
        this.setState({
            items: []
        })
        if (this.props.user){
            this.setState({
                show: true
            })
            fetch(this.props.link)
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            isLoaded: true,
                            items: result
                        });
                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
        } else {
            alert("Введите имя пользователя")
        }
    }

    editNote(heading){
        this.setState({
            showModal: true,
            heading: heading
        })
    }

    deleteNote(id){
        axios.delete(`http://localhost:8090/delete_note/${id}`)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render(){
        const { items } = this.state;
        const contentEdit = {
            content: `
                <label for="note_heading">Заголовок</label><input id="note_edit_heading" type="text" />
                <label for="note_text">Текст заметки</label><textarea id="note_edit_text"></textarea>
                <div>
                <label for="date_creation">Дата создания</label><input id="date_edit_creation" type="date" />
                </div><div>
                <label for="date_notification">Дата оповещения</label><input id="date_edit_notification" type="date" /></div>
            `
        }
        return(
            <div>
                <button
                    className="btn-getNotes btn"
                    onClick={() => this.getNotes()}
                >
                    Получить все заметки
                </button>
                {
                    this.state.show?
                        <div className="container">
                            {items.map(item => (
                                <div className="wrap" key={item.id}>
                                    <div className="dates-block-note">
                                        <div>
                                            <h5>Дата создания</h5>
                                            <Moment format="DD/MM/YYYY">
                                                {item.dateOfCreation}
                                            </Moment>
                                        </div>
                                        <div>
                                            <h5>Дата оповещения</h5>
                                            <Moment format="DD/MM/YYYY">
                                                {item.dateOfNotification}
                                            </Moment>
                                        </div>
                                    </div>
                                    <textarea className="note-heading">
                                        {item.heading}
                                    </textarea>
                                    <textarea className="note-text">
                                        {item.text}
                                    </textarea>
                                    <div className="wrap-btn-block">
                                        <button
                                            className="btn"
                                            onClick={() => this.deleteNote(item.id)}
                                        >
                                            Удалить заметку
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={() => this.editNote(item.heading)}
                                        >
                                            Редактировать заметку
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        <div></div>
                }
                {
                    this.state.showModal?
                        <Modal onShowModalChange={this.handleShowModalChange} heading={this.state.heading} content={contentEdit.content} title={'Редактирование заметки'}/>
                        :
                        <div></div>
                }
            </div>
        );
    }
}

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heading: "",
            text: "",
            dateOfCreation: "",
            dateOfNotification: "",
        }
    }

    addNote(){
        if (this.props.user && this.state.heading && this.state.text && this.state.dateOfCreation && this.state.dateOfNotification){
            const newNote = {
                heading: this.state.heading.slice(),
                text: this.state.text.slice(),
                dateOfCreation: this.state.dateOfCreation,
                dateOfNotification: this.state.dateOfNotification,
                userId: this.props.user
            };

            axios.post('http://localhost:8090/addNote', newNote)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            alert("Заполните все поля")
        }

    }

    updateInput(key, value) {
        this.setState({
            [key] : value
        })
    }

	render(){
    return(
        <div className="note-block">
            <div className="note-input">
                <input
                    className="text-input"
                    type="text"
                    placeholder="Введите заголовок"
                    value={this.state.heading}
                    onChange={(e) => this.updateInput("heading", e.target.value)}
                />
                <input
                    className="text-input"
                    type="text"
                    placeholder="Введите текст"
                    value={this.state.text}
                    onChange={(e) => this.updateInput("text", e.target.value)}
                />
            </div>
            <br/>
            <div className="dates-block">
                <div className="dates">
                    <label htmlFor="date-of-creation"> Дата создания </label>
                    <input
                        id="date-of-creation"
                        className="date-input"
                        type="date"
                        name="date-of-creation"
                        value={this.state.dateOfCreation}
                        onChange={(e) => this.updateInput("dateOfCreation", e.target.value)}
                    />
                </div>
                <div className="dates">
                    <label htmlFor="date-of-notification"> Дата оповещения </label>
                    <input
                        id="date-of-notification"
                        className="date-input"
                        type="date"
                        name="date-of-notification"
                        value={this.state.dateOfNotification}
                        onChange={(e) => this.updateInput("dateOfNotification", e.target.value)}
                    />
                </div>
            </div>
            <button
                className="btn-add-note btn"
                onClick={() => this.addNote()}
            >
                Создать заметку
            </button>
            </div>
    )

	}
}

export default App;
