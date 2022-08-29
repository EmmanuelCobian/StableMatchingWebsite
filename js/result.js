class Result extends React.Component {
    fPrefersS1OverS(fairPref, f, s, s1, fairs) {
        /**
         * params:
         * - fairPref: list of lists with fair preferences fp[i][j] is the ith preference for the jth fair
         * - f: the fair we're using for comparison
         * - s: potential new choice for f
         * - s1: current choices for f
         */
        let results = [true, true, true];
        for (let i = 0; i < s1.length; i++) {
            let tentativeOrg = s1[i];
            for (let j = 0; j < fairPref[0].length; j++) {
                if (fairPref[fairs.indexOf(f)][j] == s) {
                    results[s1.indexOf(tentativeOrg)] = false;
                } else if (fairPref[fairs.indexOf(f)][j] == tentativeOrg) {
                    break;
                }
            }
        }

        let checkIfOrgInList = [];
        for (let i = 0; i < s1.length; i++) {
            checkIfOrgInList.push(fairPref[fairs.indexOf(f)].includes(s1[i]));
        }

        if (checkIfOrgInList.includes(false) && results.includes(false)) {
            results = checkIfOrgInList;
        }
        return results;
    }

    // orgs propose to fairs -> org optimal
    stableMatching(fairs, orgs, fPref, oPref) {
        // stores the student org partners for each fair
        let fPartners = [];
        for (let i = 0; i < fairs.length; i++) {
            fPartners.push(["None", "None", "None"]);
        }

        // oFree[i] represents whether the ith org is 'free'
        // oCurrChoice[i] represents the current preference of the ith org
        let oCurrChoice = [];
        let oFree = [];
        for (let i = 0; i < orgs.length; i++) {
            oFree.push(true);
            oCurrChoice.push(0);
        }

        // number of free orgs
        let numOfFreeOrgs = 0;
        for (let i = 0; i < oFree.length; i++) {
            if (oFree[i] == true) {
                numOfFreeOrgs += 1;
            }
        }

        // represents the iteration number the algorithm is on
        let iter = 1;

        // algorithm terminates after every org has had the chance to propse to every fair on their preference list
        while (numOfFreeOrgs > 0 && iter < (orgs.length * orgs.length)) {
            for (let currOrgIndex = 0; currOrgIndex < orgs.length; currOrgIndex++) {
                let org = orgs[currOrgIndex];
                
                // if it's the case that the current student org is already matched, then continue to the next org
                if (oFree[currOrgIndex] == false) {
                    continue;
                }

                // if not, then propose to their next best choice
                let topChoice = oPref[currOrgIndex][oCurrChoice[currOrgIndex]];
                let topChoiceIndex = fairs.indexOf(topChoice);
                // console.log('iteration:', iter, 'top:', topChoice); console.log('org & index:', org, currOrgIndex);
                // console.log('org choice list:', oCurrChoice);
                // console.log(iter, topChoiceIndex);
                // if no one has proposed to the student org's top choice, then propose. Else, we need to compare preferences
                let firstNone = fPartners[topChoiceIndex].indexOf("None");
                if (firstNone != -1) {
                    oFree[currOrgIndex] = false;
                    fPartners[topChoiceIndex][firstNone] = org;
                } else {
                    let tentativeOrgs = fPartners[topChoiceIndex];
                    // check to see if the fair prefers the current org to one of the tentative orgs
                    let newPreferences = this.fPrefersS1OverS(fPref, topChoice, org, tentativeOrgs, fairs);
                    if (newPreferences.includes(false)) {
                        let replacedOrg = tentativeOrgs[newPreferences.indexOf(false)];
                        oFree[orgs.indexOf(replacedOrg)] = true;
                        oCurrChoice[orgs.indexOf(replacedOrg)] += 1;

                        // check to see if we've already gone over all of the org's preferences
                        if (oCurrChoice[orgs.indexOf(replacedOrg)] == 3) {
                            oFree[orgs.indexOf(replacedOrg)] = false;
                            oCurrChoice[orgs.indexOf(replacedOrg)] -= 1;
                        }

                        fPartners[topChoiceIndex][fPartners[topChoiceIndex].indexOf(replacedOrg)] = org;
                        oFree[currOrgIndex] = false;
                    } else {
                        oCurrChoice[currOrgIndex] += 1;
                        if (oCurrChoice[currOrgIndex] == 3) {
                            oFree[currOrgIndex] = false;
                            oCurrChoice[currOrgIndex] -= 1;
                        }
                    }
                }
                numOfFreeOrgs = 0;
                for (let j = 0; j < oFree.length; j++) {
                    if (oFree[j] == 1) {
                        numOfFreeOrgs += 1;
                    }
                }
            }
            iter += 1;
        }

        let result = [];
        for (let i = 0; i < fairs.length; i++) {
            fPartners[i].splice(0, 0, fairs[i])
            result.push(fPartners[i]);
        }
        return result;
    }

    renderTblRow(key, i) {
        return (
            <tr>
                <th scope="row">{key[0]}</th>
                <td>{key[1]}</td>
                <td>{key[2]}</td>
                <td>{key[3]}</td>
            </tr>
        );
    }

    render() {
        // est prop variables
        let orgCsvData = this.props.orgData;
        let orgInfoLoc = this.props.orgInfo;
        let fairCsvData = this.props.fairData;
        let fairInfoLoc = this.props.fairInfo;

        console.log("org data:", orgCsvData);
        console.log("org info:", orgInfoLoc);
        console.log("fair data:", fairCsvData);
        console.log("fair info:", fairInfoLoc);

        let orgs = [];
        let orgPref = [];

        // set the preferences of the orgs
        let orgLoc = orgInfoLoc[0];
        let op1 = orgInfoLoc[1];
        let op2 = orgInfoLoc[2];
        let op3 = orgInfoLoc[3];

        for (let i = 0; i < orgCsvData.length; i++) {
            let orgName = orgCsvData[i][orgLoc];
            let p1 = orgCsvData[i][op1];
            let p2 = orgCsvData[i][op2];
            let p3 = orgCsvData[i][op3];
            if (orgName) {
                orgs.push(orgName);
            }
            if (p1 && p2 && p3) {
                orgPref.push([p1, p2, p3]);
            }
        }

        let fairs = [];
        let fairPref = [];

        // set the preferences for the fairs
        let fairLoc = fairInfoLoc[4];
        let fp1 = fairInfoLoc[5];
        let fp2 = fairInfoLoc[6];
        let fp3 = fairInfoLoc[7];

        for (let i = 0; i < fairCsvData.length; i++) {
            let fairName = fairCsvData[i][fairLoc]
            let p1 = fairCsvData[i][fp1];
            let p2 = fairCsvData[i][fp2];
            let p3 = fairCsvData[i][fp3];
            if (fairName) {
                fairs.push(fairName);
            }
            if (p1 && p2 && p3) {
                fairPref.push([p1, p2, p3]);
            }
        }
        
        let result = this.stableMatching(fairs, orgs, fairPref, orgPref);
        console.log("RESULTS:", result);

        return (
            <div>
                <h6>Here are the results</h6>
                <div class="table-responsive-md">
                    <table class="table table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">Event Name</th>
                                <th scope="col">Choice 1</th>
                                <th scope="col">Choice 2</th>
                                <th scope="col">Choice 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((obj, i) => this.renderTblRow(obj, i))}  
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}