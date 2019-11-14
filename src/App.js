import React, {Component} from 'react';

const _API_ENDPOINT = 'http://localhost:8081/berechnen';

class App extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.requestData = this.requestData.bind(this);
    }

    state = {
        tilgungsplan: {
            anfrage: {
                darlehensbetrag: null,
                sollzinssatz: null,
                jahrTilgungProzent: null,
                zinsbindungsdauer: null,
            },
            monatsRate: null,
            restSchuld: null,
            tilgungen: []
        }
    };

    requestData() {
      if (
          !this.darlehensbetrag.value
          || !this.jahrTilgungProzent.value
          || !this.sollzinssatz.value
      ) {
        return;
      }
      this.berechnen.disabled = true;
      let query = '?darlehensbetrag=' + this.darlehensbetrag.value
          + '&sollzinssatz=' + this.sollzinssatz.value
          + '&tilgung=' + this.jahrTilgungProzent.value
          + '&zinsbindungsdauer=' + this.zinsbindungsdauer.value;
      fetch(_API_ENDPOINT + query)
          .then(res => res.json())
          .then((data) => {
            this.setState({tilgungsplan: data});
            this.berechnen.disabled = false;
            // console.log(this.state.tilgungsplan);
          })
          .catch(console.log)
    }

    onSubmit(e) {
        e.preventDefault();
        this.requestData();
    }

    onChange(e) {
        e.preventDefault();
        this.requestData();
    }

    numberformatter = new Intl.NumberFormat('de-DE');

    currencyformat(number) {
        return this.numberformatter.format(Math.floor(number));
    }

    percentformat(number) {
        return this.numberformatter.format(number);
    }

    render() {
        return (
            <div className="App">
                <div id="title"><h1 className="h1 container-fluid">Tilgungsapp Berechner</h1></div>
                <div id="layout" className="container row">
                    <div id="form-container" className="align-content-center col-sm-8">
                        <label htmlFor="darlehensbetrag">Darlehensbetrag (€)</label>
                        <input name="darlehensbetrag" type="number" id="darlehensbetrag"
                               className="form-control col-sm-2"
                               onBlur={this.onChange}
                               placeholder="300000" required autoFocus ref={(c) => this.darlehensbetrag = c}/>

                        <label htmlFor="sollzinssatz">Sollzinssatz (%)</label>
                        <input name="sollzinssatz" type="number" id="sollzinssatz" className="form-control col-sm-2"
                               onBlur={this.onChange}
                               placeholder="1.5" required ref={(c) => this.sollzinssatz = c}/>

                        <label htmlFor="jahrTilgungProzent">Anfänglicher Tilgung (%)</label>
                        <input name="jahrTilgungProzent" type="number" id="jahrTilgungProzent"
                               className="form-control col-sm-2"
                               onBlur={this.onChange}
                               placeholder="1.0" required ref={(c) => this.jahrTilgungProzent = c}/>

                        <label htmlFor="zinsbindungsdauer">Zinsbindungsdauer (Jahre)</label>
                        <input name="zinsbindungsdauer" type="number" id="zinsbindungsdauer"
                               className="form-control col-sm-2"
                               onBlur={this.onChange}
                               placeholder="1" ref={(c) => this.zinsbindungsdauer = c}/>
                        <br/>
                        <button
                            id="berechnen"
                            onClick={this.onSubmit}
                            className="btn btn-sm btn-primary btn-block col-sm-2"
                            type="button"
                            ref={(c) => this.berechnen = c}>Berechnen
                        </button>
                    </div>
                    <div id="tilgungsplan-container" className="col-sm-4">
                        <h4 className="h4">Tilgungsplan Anfrage</h4>
                        <div id="tilgungsplan-anfrage-container">
                            <table className="table">
                                <tbody>
                                <tr>
                                    <td className="col-sm-4 font-weight-bold">Darlehensbetrag</td>
                                    <td className="col-sm-4 font-weight-normal">{this.currencyformat(this.state.tilgungsplan.anfrage.darlehensbetrag)}€</td>
                                </tr>
                                <tr>
                                    <td className="col-sm-4 font-weight-bold">Sollzinssatz</td>
                                    <td className="col-sm-4 font-weight-normal">{this.state.tilgungsplan.anfrage.sollzinssatz}%</td>
                                </tr>
                                <tr>
                                    <td className="col-sm-4 font-weight-bold">Anfänglicher Tilgung</td>
                                    <td className="col-sm-4 font-weight-normal">{this.state.tilgungsplan.anfrage.jahrTilgungProzent}%</td>
                                </tr>
                                <tr>
                                    <td className="col-sm-4 font-weight-bold">Zinsbindungsdauer (Jahre)</td>
                                    <td className="col-sm-4 font-weight-normal">{this.state.tilgungsplan.anfrage.zinsbindungsdauer}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <h4 className="h4">Tilgungsplan Detail</h4>
                        <div id="tilgungsplan-detail-container">
                            <table className="table">
                                <tbody>
                                <tr>
                                    <td className="col-sm-4 font-weight-bold">Monatsrate</td>
                                    <td className="col-sm-4 font-weight-normal">{this.currencyformat(this.state.tilgungsplan.monatsRate)}€</td>
                                </tr>
                                <tr>
                                    <td className="col-sm-4 font-weight-bold">Restbetrag am Ende</td>
                                    <td className="col-sm-4 font-weight-normal">{this.currencyformat(this.state.tilgungsplan.restSchuld)}€</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <h4 className="h4">Tilgungsplan Verlauf</h4>
                        <table className="table">
                            <thead>
                            <tr>
                                <td>Monat</td>
                                <td>Datum</td>
                                <td>Tilgung</td>
                                <td>Sollzinssatz</td>
                                <td>Betrag</td>
                                <td>Zinsen</td>
                                <td>Restbetrag</td>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.tilgungsplan.tilgungen.map((tilgung) => (
                                <tr key={tilgung.monat}>
                                    <td>{tilgung.monat}</td>
                                    <td>{tilgung.datum.substr(5, 2) + '/' + tilgung.datum.substr(0, 4)}</td>
                                    <td>{this.percentformat(tilgung.jahrTilgungProzent)}%</td>
                                    <td>{this.percentformat(tilgung.jahrZinsProzent)}%</td>
                                    <td>{this.currencyformat(tilgung.betragsWert)}€</td>
                                    <td>{this.currencyformat(tilgung.zinsWert)}€</td>
                                    <td>{this.currencyformat(tilgung.restBetrag)}€</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
