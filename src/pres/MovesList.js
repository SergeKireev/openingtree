import {Progress } from "reactstrap"
import React from 'react'
import { Table, TableRow, TableHead, TableBody, TableCell, TableFooter } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

export default class MovesList extends React.Component {

    move(from, to) {
        return () => {
            this.props.onMove(from, to)
        }
    }
    launch(url) {
        return () => {
            window.open(url, '_blank');
        }
    }
    render(){
        if(!this.props.settings.playerName) {
            return <div className = "infoMessage" >No moves to show. Please enter a lichess or chess.com user name in the 
                <span className = "navLinkButton" onClick={()=>this.props.switchToUserTab()}> <FontAwesomeIcon icon={faUser} /> User</span> tab and click "Load"</div>
        }
    return <div>{(this.props.gameResults && this.props.gameResults.length>0)?this.resultsTable():null}
                {this.movesTable()}</div>
    }
    resultsTable() {
        return <Table>
            <TableBody>
                {
                this.props.gameResults.map(result => {
                    let whitePlayer = this.player(result.white, result.whiteElo)
                    let blackPlayer = this.player(result.black, result.blackElo)
                    return <TableRow className="moveRow" key = {`${result.url}`} onClick={this.launch(result.url)}>
                        <TableCell>
                            {result.result==="1-0"?<b>{whitePlayer}</b>:whitePlayer} {result.result} {result.result === "0-1"?<b>{blackPlayer}</b>:blackPlayer}
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    }
    player(name, elo) {
        return `${name}(${elo})`
    }
    movesTable() {
        let hasMoves = (this.props.movesToShow && this.props.movesToShow.length>0)
        return <Table>
            {hasMoves?
        <TableHead>
        <TableRow>
            <TableCell size="small" className="smallCol"><b>Move</b></TableCell>
            <TableCell size="small" className="smallCol"><b>Games</b></TableCell>
            <TableCell><b>Results</b></TableCell>
        </TableRow></TableHead>  
        :null}
        {hasMoves?
        <TableBody>
        {
        this.props.movesToShow.map(move => {
            let sampleResultWhite = this.player(move.sampleResult.white, move.sampleResult.whiteElo)
            let sampleResultBlack = this.player(move.sampleResult.black, move.sampleResult.blackElo)
            let sampleResult = move.sampleResult.result
            
            return move.count > 1?<TableRow className="moveRow" key = {`${move.orig}${move.dest}`} onClick={this.move(move.orig, move.dest)}>
                <TableCell size="small" className="smallCol">{move.san}</TableCell>
                <TableCell size="small" className="smallCol">{move.count}</TableCell>
                <TableCell>
                    <Progress className = "border" multi>
                        <Progress bar className="whiteMove" value={`${move.whiteWins/move.count*100}`}>{move.whiteWins/move.count>0.1?move.whiteWins:''}</Progress>
                        <Progress bar className="grayMove" value={`${move.draws/move.count*100}`}>{move.draws/move.count>0.1?move.draws:''}</Progress>
                        <Progress bar className="blackMove" value={`${move.blackWins/move.count*100}`}>{move.blackWins/move.count>0.1?move.blackWins:''}</Progress>
                    </Progress>
                </TableCell>
            </TableRow>:
            <TableRow className="moveRow" key = {`${move.orig}${move.dest}`} onClick={this.move(move.orig, move.dest)}>
                <TableCell size="small" className="smallCol">{move.san}</TableCell>
                <TableCell colSpan = "2">
                            {sampleResultWhite} {sampleResult} {sampleResultBlack} {<FontAwesomeIcon onClick ={this.launch(move.sampleResult.url)} icon={faExternalLinkAlt}/>}
                </TableCell>
            </TableRow>
            }
        )}
    </TableBody>
    :null}
        <TableFooter><TableRow>
        {
        hasMoves?
            <TableCell colSpan="3">
            Showing moves that have been 
            played {this.props.turnColor === this.props.settings.playerColor? "by" : "by others against"} <b>{this.props.settings.playerName}</b> in 
            this position. <b>{this.props.settings.playerName}</b> is playing as <b>{this.props.settings.playerColor}</b>.
            </TableCell>:
            <TableCell colSpan="3">
            No moves found in this position played {this.props.turnColor === this.props.settings.playerColor? "by" : "by others against"} <b>{this.props.settings.playerName}</b> in 
            this position. <b>{this.props.settings.playerName}</b> is playing as <b>{this.props.settings.playerColor}</b>.
            </TableCell>
        }</TableRow></TableFooter>
    </Table>
    }
}