import React from "react";
import { useEffect, useState } from "react";
import useSignTeam from "../hooks/useSignTeam";
import TeamStats from "./TeamStats";

const GreedGameTeamSelect = ({setGameStatus, library, account, tokens, numTokensOwned, tokenAPIUri}) => {
    // for state of register button
    const [registerActive, setRegisterActive] = useState("");
    const [teamString, setTeamString] = useState("");

    // create vars for all of the team slots and give default blank data
    const defaultSlotData = {"image":"https://member.greed.games/portraits/trash/220117-162435_735672_lg500_tuning_images--.png","id":"","guild":"Select"};
    const [teamSlot1, setTeamSlot1] = useState(defaultSlotData);
    const [teamSlot1Status, setTeamSlot1status] = useState("unselected");
    const [teamSlot2, setTeamSlot2] = useState(defaultSlotData);
    const [teamSlot2Status, setTeamSlot2status] = useState("unselected");
    const [teamSlot3, setTeamSlot3] = useState(defaultSlotData);
    const [teamSlot3Status, setTeamSlot3status] = useState("unselected");

    function makeTeamString(teamSlot1, teamSlot2, teamSlot3) {
        let newString = "";
        if(teamSlot1.id != "") newString = newString + teamSlot1.guild+teamSlot1.id;
        if(teamSlot2.id != "") newString = newString + teamSlot2.guild+teamSlot2.id;
        if(teamSlot3.id != "") newString = newString + teamSlot3.guild+teamSlot3.id;
        setTeamString(newString);
    }

    useEffect(() => {
        makeTeamString(teamSlot1, teamSlot2, teamSlot3)
    }, [teamSlot1, teamSlot2, teamSlot3])


    const onPortraitClick = (t) => {
        let filled = false;
        const slotData = {
            "image":tokenAPIUri+t.tokenIndex+"/image",
            "id": "#"+Math.floor(t.tokenIndex/7),
            "guild": t.guild
        }
        if(teamSlot1Status == "unselected") {
            // prevent duplicates of both guild and id
            if(!(slotData.id == teamSlot2.id && slotData.guild == teamSlot2.guild) && !(slotData.id == teamSlot3.id && slotData.guild == teamSlot3.guild) ) {
                setTeamSlot1(slotData);
                setTeamSlot1status("selected");
                filled = true;
            }
        }
        if(teamSlot2Status == "unselected" && !filled) {
            if(!(slotData.id == teamSlot1.id && slotData.guild == teamSlot1.guild) && !(slotData.id == teamSlot3.id && slotData.guild == teamSlot3.guild) ) {
                setTeamSlot2(slotData);
                setTeamSlot2status("selected");
                filled = true;
            }
        }
        if(teamSlot3Status == "unselected" && !filled) {
            if(!(slotData.id == teamSlot1.id && slotData.guild == teamSlot1.guild) && !(slotData.id == teamSlot2.id && slotData.guild == teamSlot2.guild) ) {
                setTeamSlot3(slotData);
                setTeamSlot3status("selected");

                // make register button active
                setRegisterActive("active");
            }
        }
    }

    const onTeamPortraitClick = (slotNumber) => {
        if(slotNumber == 1) {
            setTeamSlot1(defaultSlotData);
            setTeamSlot1status("unselected");
        }

        if(slotNumber == 2) {
            setTeamSlot2(defaultSlotData);
            setTeamSlot2status("unselected");
        }

        if(slotNumber == 3) {
            setTeamSlot3(defaultSlotData);
            setTeamSlot3status("unselected");
        }

        // make button inactive
        setRegisterActive("");
    }

    let listTokens: JSX.Element[];

    // the component for each token you could select
    if(tokens.length > 0 && numTokensOwned > 0) { 
        listTokens = tokens.map((t) => {
            if(t.owner == account) {
                return(
            <div className={t.guild+"-glow portrait"} key={t.tokenIndex}>
                <div className="portrait-label glow"><span className={t.guild}>{t.guild} Gladiator</span></div>
                <div className="portrait-id"><span className={t.guild}> #{Math.floor(t.tokenIndex/7)}</span></div>
                <img className="low-glow" src={tokenAPIUri+t.tokenIndex+"/image"}  onClick={() => onPortraitClick(t)} />
            </div>)
            }
        }).reverse()
    }

    // get the mint tx call to pass as an onclick event
    const callSign = useSignTeam(library, "team: "+teamString);

    return (
        <div>
            <div className="team">
                <div className="portraits-title">YOUR TEAM 
                    <div className="float-right py-30 relative">
                        <button 
                className={registerActive+" px-3 py-1 text-lg lg:text-x1 lg:px-6 lg:py-2 xl:text-lg xl:px-5 xl:py-2 font-medium text-white rounded-sm outline outline-2 z-10 register-team-button"}
                onClick={() => callSign()}
            >Register team with the Gameskeeper →</button>
                    </div> 
                </div>
                
            </div>
            <div className="team-portraits">
                <div className='portrait-container'>
                    <div className={teamSlot1['guild']+"-glow portrait "+teamSlot1Status} id="team-1">
                        <div className="portrait-label glow"><span className={teamSlot1['guild']}>{teamSlot1['guild']} Gladiator</span></div>
                        <div className="portrait-id"><span className={teamSlot1['guild']}> {teamSlot1['id']}</span></div>
                        <img src={teamSlot1['image']} onClick={() => onTeamPortraitClick(1)} />
                    </div>
                    <div className={teamSlot2['guild']+"-glow portrait "+teamSlot2Status} id="team-2">
                        <div className="portrait-label glow"><span className={teamSlot2['guild']}>{teamSlot2['guild']} Gladiator</span></div>
                        <div className="portrait-id"><span className={teamSlot2['guild']}> {teamSlot2['id']}</span></div>
                        <img src={teamSlot2['image']} onClick={() => onTeamPortraitClick(2)} />
                    </div>
                    <div className={teamSlot3['guild']+"-glow portrait "+teamSlot3Status} id="team-3">
                        <div className="portrait-label glow"><span className={teamSlot3['guild']}>{teamSlot3['guild']} Gladiator</span></div>
                        <div className="portrait-id"><span className={teamSlot3['guild']}> {teamSlot3['id']}</span></div>
                        <img src={teamSlot3['image']} onClick={() => onTeamPortraitClick(3)} />
                    </div>
                    <div className="portrait" id="team-stats">
                        <TeamStats p1={teamSlot1} p2={teamSlot2} p3={teamSlot3} />
                    </div>
                </div>
            </div>
            <div className="portraits clear">
                <div className="portraits-title"><span className="text-green-400 font-bold drop-shadow-md shadow-black">{numTokensOwned}</span> GLADIATOR NFTs</div>
                <div className='portrait-container'>{listTokens}</div>
            </div>
            <div className="back-button text-center text-white font-normal text-lg mb-5">
                <button 
                className="px-3 py-1 m-3 text-lg lg:text-xl lg:px-6 lg:py-2 xl:text-xl xl:px-8 xl:py-3 font-medium text-white rounded-sm outline outline-2 bg-black/30 hover:bg-white/30 hover:text-white hover:outline-white z-10"
                onClick={() => setGameStatus("Minting")}
            >🠔 Back to Mint Gladiators</button>
            </div>
        </div>
    )

};

export default GreedGameTeamSelect;
