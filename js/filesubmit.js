class FileSubmit extends React.Component {
    render() {
        let validInput = "";
        if (!this.props.valid) {
            validInput = "Please submit a valid file";
        } else {
            validInput = "";
        }

        return (
            <form onSubmit={this.props.onSubmit}>
                <div class="mb-3">
                    <h6>{this.props.prompt}</h6>
                </div>
                <div class="btn-group" role="group">
                    <label id="file-upload" class='btn rounded'>
                        <span class='bi-upload'> </span>
                        Upload File:
                        <input name="input" type='file' ref={this.props.fileInput} accept='.csv'/>
                    </label>

                    <label for='file-submit'>
                        <button id='file-submit' class='btn rounded' type='submit'>Submit</button>
                    </label>
                </div>
                <div id='warning-text'>{validInput}</div>
            </form>
        );
    }
}