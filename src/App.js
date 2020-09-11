import React, { Component } from "react";
import "./App.css";
import {
  Container,
  Row,
  Col,
  Modal,
  Form,
  FormControl,
  FormLabel,
  FormGroup,
  Button,
} from "react-bootstrap";

import form from "./jsonFormInjured.json";
import * as Survey from "survey-react";
import "react-datepicker/dist/react-datepicker.css";

//Definimos la fecha actual para guardar en el State
let date = new Date();
let dd = date.getDate();
let mm = date.getMonth() + 1;
if (dd < 10) dd = "0" + dd;
if (mm < 10) mm = "0" + mm;
let fecha = date.getFullYear() + "-" + mm + "-" + dd;

//Define el thema y crea el modelo del Survey
let themeColors = Survey.StylesManager.ThemeColors["default"];
themeColors["$main-color"] = "#13639E";
themeColors["$main-hover-color"] = "#2F89CB ";
themeColors["$text-color"] = "#5C5D5E";
themeColors["$header-color"] = "#B2B4B6 ";
themeColors["$header-background-color"] = "#E6F2FA";
themeColors["$body-container-background-color"] = "#f8f8f8";

let myCss = {
  navigationButton: "btn btn-sm mt-3 ",
  imagepicker: {
    root: "h6 text-center text-muted",
    itemChecked: "text-light checked text-bold ",
  },
  paneldynamic: {
    buttonAdd: "sv-paneldynamic__add-btn btn btn-sm",
    root: "sv_panel_dynamic  m-5",
    progress: "sv-progress bg-inverse",
    buttonRemove: "btn btn-danger bg-danger btn-sm",
    buttonAdd: "sv-paneldynamic__add-btn btn  bg-success btn-sm",
  },
};

Survey.StylesManager.applyTheme();
let survey = new Survey.Model(form);

let q = survey.getQuestionByName("injuries");
let cssTypeCvr = q.cssClasses;
console.log(cssTypeCvr);

//GUARDA EL PROGRESO EN EL STATTE
var storageName = "saveSurvey";
var timerId = 0;
var loadState = (survey) => {
  //Here should be the code to load the data from your database
  var storageSt = window.localStorage.getItem(storageName) || "";
  var res = {};
  if (storageSt) res = JSON.parse(storageSt);
  //Create the survey state for the demo. This line should be deleted in the real app.
  else
    res = {
      currentPageNo: 0,
      data: JSON.stringify(survey.data),
    };

  //Set the loaded data into the survey.
  if (res.currentPageNo) survey.currentPageNo = res.currentPageNo;
  if (res.data) survey.data = res.data;
};
var saveState = (survey) => {
  var res = {
    currentPageNo: survey.currentPageNo,
    data: survey.data,
  };
  //Here should be the code to save the data into your database
  window.localStorage.setItem(storageName, JSON.stringify(res));
};
//Load the initial state
loadState(survey);
timerId = window.setInterval(() => {
  saveState(survey);
}, 1000);

//*************************** Establece los valores por default en los inputs al Cargar el Form*******************************
const setDefaultDate = () => {
  let injury_date = survey.getQuestionByName("injury_date");
  let storeDate = injury_date.value;
  //TTD Date start
  let temporary_disability_start_date = survey.getQuestionByName(
    "temporary_disability_start_date"
  );
  temporary_disability_start_date.min = storeDate;
  temporary_disability_start_date.max = fecha;
  //Deshabilite hasta el presente
  let disability_to_the_present = survey.getQuestionByName(
    "disability_to_the_present"
  );
  //TTD Date start
  let temporary_disability_end_date = survey.getQuestionByName(
    "temporary_disability_end_date"
  );
  if (disability_to_the_present.value == true) {
    temporary_disability_end_date.value = fecha;
    temporary_disability_end_date.min = storeDate;
    temporary_disability_end_date.max = fecha;
  } else {
    temporary_disability_end_date.min = storeDate;
    temporary_disability_end_date.max = fecha;
  }
  //PTD DATE START
  let respective_duty_start_date = survey.getQuestionByName(
    "respective_duty_start_date"
  );
  respective_duty_start_date.min = storeDate;
  respective_duty_start_date.max = fecha;

  //PTD DATE END
  let respective_duty_end_date = survey.getQuestionByName(
    "respective_duty_end_date"
  );
  respective_duty_end_date.min = storeDate;
  respective_duty_end_date.max = fecha;
  //Mostramos al usuario la fecha de la lesión
  let message = survey.getQuestionByName("html_injury_date");
  let cadFecha = storeDate;
  if (cadFecha == null) cadFecha = fecha;
  cadFecha =
    cadFecha.substr(8, 2) +
    "/" +
    cadFecha.substr(5, 2) +
    "/" +
    cadFecha.substr(0, 4);
  message.html =
    "<div style='color:white;background:#476092;'><h3>Tu accidente ocurrió el: " +
    cadFecha +
    "<h3></div>";
  let typeCvr = survey.getQuestionByName("type_of_cvr");
  if (typeCvr.value) message.visible = true;
  //
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      modalDateInjury: false,
      htmlDate: false,
      injuryDate: fecha,
      defaultInjuryDate: fecha,
      modalPay: false,
    };
    this.dateModalInjury = React.createRef();
    this.resultado = React.createRef();
  }
  //***************************************** SHOW/HIDE MODEL DATE INJURY**************************************************
  handleModal = () => {
    this.setState({
      modalDateInjury: !this.state.modalDateInjury,
    });
  };
  //***************************************** SHOW/HIDE MODAL Pay**************************************************
  handleModalPay = () => {
    this.setState({
      modalPay: !this.state.modalPay,
    });
  };
  //********ASIGNACIÓN DE LÍMITES PARA LOS INPUTS DE TODO EL FORMS al cambiar o asignar la Fecha de la lesión***********
  setDateInjury = () => {
    this.setState({
      injuryDate: this.dateModalInjury.current.value,
    });
    //Establecemos la fecha de la lesión
    let injury_date = survey.getQuestionByName("injury_date");
    injury_date.value = this.dateModalInjury.current.value;
    //TTD Date start
    let temporary_disability_start_date = survey.getQuestionByName(
      "temporary_disability_start_date"
    );
    temporary_disability_start_date.min = this.dateModalInjury.current.value;
    //Deshabilite hasta el presente
    let disability_to_the_present = survey.getQuestionByName(
      "disability_to_the_present"
    );
    //TTD Date start
    let temporary_disability_end_date = survey.getQuestionByName(
      "temporary_disability_end_date"
    );
    if (disability_to_the_present.value == true) {
      temporary_disability_end_date.min = this.dateModalInjury.current.value;
    } else {
      temporary_disability_end_date.min = this.dateModalInjury.current.value;
    }
    //PTD DATE START
    let respective_duty_start_date = survey.getQuestionByName(
      "respective_duty_start_date"
    );
    respective_duty_start_date.min = this.dateModalInjury.current.value;

    //PTD DATE END
    let respective_duty_end_date = survey.getQuestionByName(
      "respective_duty_end_date"
    );
    respective_duty_end_date.min = this.dateModalInjury.current.value;

    let message = survey.getQuestionByName("html_injury_date");
    let cadFecha = this.dateModalInjury.current.value;

    cadFecha =
      cadFecha.substr(8, 2) +
      "/" +
      cadFecha.substr(5, 2) +
      "/" +
      cadFecha.substr(0, 4);
    message.html =
      "<div style='color:white;background:#476092;'><h3>Tu accidente ocurrió el: " +
      cadFecha +
      "<h3></div>";
    message.visible = true;
  };

  render() {
    //Condición para el despliegue del modal de "Type of CVR"
    var type_cvr = survey.getQuestionByName("type_of_cvr");
    if (type_cvr)
      type_cvr.onValueChanged = () => {
        this.setState({ modalDateInjury: true });
      };
    //Establecer Fecha actual para el Botón "Deshabilite hasta el Presente"
    let disability = survey.getQuestionByName("disability_to_the_present");
    let temporary_disability_end_date = survey.getQuestionByName(
      "temporary_disability_end_date"
    );
    disability.onValueChanged = () => {
      if (disability.value) temporary_disability_end_date.value = fecha;
    };
    let typeCvr = document.getElementsByName("type_of_cvr");
    let typeCvr2 = survey.getQuestionByName("type_of_cvr");
    typeCvr2.onClick = () => {
      alert("entres?");
      this.setState({
        modalDateInjury: !this.state.modalDateInjury,
      });
    };
    typeCvr.onclick = () => {
      alert("entres?");
      this.setState({
        modalDateInjury: !this.state.modalDateInjury,
      });
    };

    return (
      <Container>
        <Row>
          <Col md={12}>
            <Survey.Survey
              model={survey}
              onAfterRenderSurvey={() => setDefaultDate()}
              css={myCss}
              onComplete={() => this.handleModalPay()}
            />
          </Col>
        </Row>
        <Row>
            <Col>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Resultado</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="10"
                  value={JSON.stringify(survey.data)}
                />
              </Form.Group>
            </Col>
          </Row>
        <Modal
          show={this.state.modalDateInjury}
          onHide={() => this.handleModal()}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>DATE OF INJURY</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <FormLabel>When did the injury occur?</FormLabel>
              <FormControl type="date" ref={this.dateModalInjury} />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModal()}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                this.handleModal();
                this.setDateInjury();
              }}
            >
              Save Date
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.modalPay}
          onHide={() => this.handleModalPay()}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>PAY METHOD</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <FormLabel>Ingrese su método de pago</FormLabel>
              <FormControl type="date" ref={this.dateModalInjury} />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModalPay()}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                this.handleModalPay();
                this.setDateInjury();
              }}
            >
              Save Date
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default App;
