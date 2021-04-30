import React from "react";
import axios from "axios";

class Modal extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.props.onShowModalChange();
    }

    createContentFromProp(prop) {
        return {__html: prop};
    }

    putRequest(){
        const editNote = {
            heading: document.getElementById('note_edit_heading').value,
            text: document.getElementById('note_edit_text').value,
            dateOfCreation: document.getElementById('date_edit_creation').value,
            dateOfNotification: document.getElementById('date_edit_notification').value,
        }

        axios.put(`http://localhost:8090/edit_note/${this.props.heading}`, editNote)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        this.handleChange()
    }

    modalClose(){
        document.getElementById('vmodal').remove()
    }



    render(){
        const content = <div dangerouslySetInnerHTML={this.createContentFromProp(this.props.content)} />

        return(
            <div id='vmodal' className='vmodal  open'>
                <div className="modal-overlay" data-close="true">
                    <div className="modal-window">
                        <div className="modal-header">
                            <span className="modal-title">{this.props.title}</span>
                            <span className="modal-close" data-close="true">&times;</span>
                        </div>
                        <div className="modal-body">
                            {content}
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => this.putRequest()}>Ok</button>
                            <button onClick={() => this.modalClose()}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;