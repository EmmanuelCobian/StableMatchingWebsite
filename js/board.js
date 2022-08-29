class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = 
        { 
            pressed0:false,
            valid0:true,
            pressed1:false,
            valid1:true,
            pressed2:false,
            valid2:true,
            orgData:[],
            checkboxes:{},
            selections:[],
            orgInfo:{},
            orgQuestions:["Select the column of the Student Orgs first choice", "Select the column of the Student Orgs second choice", "Select the column of the Student Orgs third choice", "Select the column where Fairs are listed:"],
            currPrompt:"Select the column where Student Orgs are listed:",
            promptNum:0,
            fairData:[],
            fairInfo: {},
            fairQuestions:["Select the column of the Fairs' first choice", "Select the column of the Fairs' second choice", "Select the column of the Fairs' third choice"],

        };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setOrgPref = this.setOrgPref.bind(this);
        this.setFairPref = this.setFairPref.bind(this);
        this.fileInput = React.createRef();
    }

    handleFormSubmit(event) {
        event.preventDefault();
        let fileInput = this.fileInput.current;
        if (fileInput.value != '' && fileInput.value.charAt(fileInput.value.length - 1) == 'v') {
            Papa.parse(fileInput.files[0], {
                header: true,
                complete: (result) => {
                    // this.setFileVars(result);
                    if (this.state.promptNum == 4) {
                        this.setState({
                            pressed2:true,
                            fairData:result.data,
                            valid2:true,
                        });
                    } else {
                        this.setState({
                            pressed0:true,
                            orgData:result.data,
                            valid0:true,
                        });
                    }
                }
            });
        } else {
            if (this.state.promptNum == 4) {
                this.setState({valid2:false});
            } else {
                this.setState({valid0:false});
            }
        }
    }

    handleChange(event) {
        let index = event.target.id;
        let checkboxTemp = this.state.checkboxes;
        if (!checkboxTemp[index] && event.target.checked) {
            checkboxTemp[index] = true;
        } else {
            checkboxTemp[index] = false;
        }
        this.setState({checkboxes:checkboxTemp});
    }

    setOrgPref(event) {
        event.preventDefault();
        let checkboxTemp = this.state.checkboxes;
        let keys = Object.keys(checkboxTemp);
        let count = 0;
        let finalIndex = -1;

        for (let i = 0; i < keys.length; i++) {
            let curElm = checkboxTemp[keys[i]];
            if (curElm) {
                finalIndex = i;
                count++;
            }
        }

        if (count != 1) {
            this.setState({
                valid1:false,
                pressed1:true,
            });
        } else {
            let temporgs = this.state.orgInfo;
            temporgs[this.state.promptNum] = keys[finalIndex];
            let tempselect = this.state.selections;
            tempselect.push(keys[finalIndex]);

            this.setState({
                pressed1:true,
                valid1:true,
                orgInfo:temporgs,
                currPrompt:this.state.orgQuestions.shift(),
                promptNum:this.state.promptNum + 1,
                checkboxes:{},
            });

            location.href = "#get-started";
        }
    }

    setFairPref(event) {
        event.preventDefault();
        let checkboxTemp = this.state.checkboxes;
        let keys = Object.keys(checkboxTemp);
        let count = 0;
        let finalIndex = -1;

        for (let i = 0; i < keys.length; i++) {
            let curElm = checkboxTemp[keys[i]];
            if (curElm) {
                finalIndex = i;
                count++;
            }
        }

        if (count != 1) {
            this.setState({
                valid2:false,
                pressed2:true,
            });
        } else {
            let tempfairs = this.state.fairInfo;
            tempfairs[this.state.promptNum] = keys[finalIndex];
            let tempselect = this.state.selections;
            tempselect.push(keys[finalIndex]);

            this.setState({
                pressed2:true,
                valid2:true,
                fairInfo:tempfairs,
                currPrompt:this.state.fairQuestions.shift(),
                promptNum: this.state.promptNum + 1,
                checkboxes:{},
            });
        }
    }

    renderForm(formType) {
        if (formType == 'org file') {
            return (
                <FileSubmit 
                valid={this.state.valid0}
                onSubmit={this.handleFormSubmit}
                fileInput={this.fileInput}
                prompt={"Upload a .csv file where Student Org preferences are located"}
                ></FileSubmit>
            );
        } else if (formType == "org user") {
            return (
                <UserInput
                data={this.state.orgData}
                handleChange={this.handleChange}
                setVariables={this.setOrgPref}
                valid={this.state.valid1}
                prompt={this.state.currPrompt}
                checkboxes={this.state.checkboxes}
                selections={this.state.selections}
                ></UserInput>
            );
        } else if (formType == 'fair file') {
            return (
                <FileSubmit
                    valid={this.state.valid2}
                    onSubmit={this.handleFormSubmit}
                    fileInput={this.fileInput}
                    prompt={"Upload a .csv file where Fair Event preferences are located"}
                ></FileSubmit>
            );
        } else if (formType == "fair user") {
            return (
                <UserInput
                    data={this.state.fairData}
                    handleChange={this.handleChange}
                    setVariables={this.setFairPref}
                    valid={this.state.valid2}
                    prompt={this.state.currPrompt}
                    checkboxes={this.state.checkboxes}
                    selections={this.state.selections}
                ></UserInput>
            );
        } else if (formType == "results") {
            return (
                <Result
                    orgData={this.state.orgData}
                    fairData={this.state.fairData}
                    orgInfo={this.state.orgInfo}
                    fairInfo={this.state.fairInfo}
                ></Result>
            );
        }
    }

    render() {
        let formType = "";
        if (this.state.promptNum == 8) {
            formType = "results";
        } else if (this.state.pressed2 && this.state.valid2) {
            formType = "fair user";
        } else if (this.state.promptNum == 4) {
            formType = 'fair file';
        } else if(this.state.pressed0 && this.state.valid0) {
            formType = "org user"
        } else {
            formType = "org file";
        }
        return (
            this.renderForm(formType)
        );
    }
}

let btnContainer = document.querySelector('#fileSelector');
ReactDOM.render(<Board />, btnContainer);