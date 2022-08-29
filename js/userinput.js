class UserInput extends React.Component {
    renderRow(key, i) {
        let disabledCheck = false;
        if (this.props.selections.includes(key)) {
            disabledCheck = true;
        }
        return (
            <div class="row mb-3 justify-content-center">
                <div class="col-4">
                    <input class='form-check-input' type='checkbox' id={key} onChange={this.props.handleChange} disabled={disabledCheck}></input>
                    <label class='form-check-label' for={key}>{key}</label>
                </div>
            </div>
        );
    }

    render() {
        let data = this.props.data;
        let keys = Object.keys(data[0]);
        let validText = "";
        if (!this.props.valid) {
            validText = "Please make a valid selection";
        } else {
            validText = "";
        }

        return (
            <div>
                <h6>{this.props.prompt}</h6>
                <div class="form-check">
                    {keys.map((obj, i) => this.renderRow(obj, i))}      
                    <button id="next-btn" type="submit" class="btn btn-dark" onClick={this.props.setVariables}>Next</button>          
                </div>
                <div id="warning-text">{validText}</div>
            </div>
        );
    }
}