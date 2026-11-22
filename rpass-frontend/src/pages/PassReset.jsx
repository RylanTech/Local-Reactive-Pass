import { useContext, useState } from "react";
import { Button, Card, Container, Form, Modal, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { PassContext } from "../contexts/PassContext";
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

function PassReset() {
    const [masterPass, setMasterPass] = useState()
    const [newMasterPass, setNewMasterPass] = useState()
    const [show, setShow] = useState(false)
    const [message, setMessage] = useState()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { resetPass } = useContext(PassContext)
    const navigate = useNavigate()

    async function handleSubmit() {
        console.log(newMasterPass)
        if (newMasterPass === "") {
            setMessage("New MasterPass requires a value")
        } else if (newMasterPass === undefined) {
            setMessage("New MasterPass requires a value")
        } else {
            const MasterPases = {
                masterPass: masterPass,
                newMasterPass: newMasterPass
            }
            let i = await resetPass(MasterPases)
            if (i) {
                setMessage(null)
                navigate('/')
            } else {
                setMessage("Wrong Password")
            }
        }
    }
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}>
                <Modal.Header closeButton
                    className="popup-model">
                    <Modal.Title>
                        <b>
                            MasterPass Reset
                        </b>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="popup-model">
                    <div className="message">
                        <center>
                        <ReportProblemOutlinedIcon/>
                        </center>
                        Resetting your MasterPass is permanent, if you lose your MasterPass there is no way to access your passwords anymore.

                        <br /><br />
                        Are you sure you want to change the MasterPass to "{newMasterPass}"
                    </div>
                </Modal.Body>
                <Modal.Footer
                    className="popup-model">
                    {message ? (
                        <>
                            <div className="col-12 message">
                                <center>
                                    {message}
                                </center>
                            </div>
                            <br />
                        </>
                    ) : (
                        <></>
                    )}
                    <Button
                        className="create-account-button"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        className="menuBtn"
                        onClick={handleSubmit}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>


            <div
                className="searchNav">
                <Container>
                    <Row className="align-items-center">
                        <div className="col-4 col-md-3 col-lg-2 wordmark-area">
                            <img 
                            src="/reactive_pass_wordmark_alt.svg" 
                            alt="Reactive Pass wordmark"
                            className="img-fluid" />
                        </div>
                        <div className="col-4 col-md-6 col-lg-7"></div>
                        <Link to="/" className="col-4 col-md-3">
                            <Button className="topMenuBtn w-100">
                                Home
                            </Button>
                        </Link>
                    </Row>
                </Container>
            </div>
            <Container>
                <br />
                <Row>

                    <div
                        className="col-md-1 col-lg-2" />
                    <Card
                        className="container-card col-12 col-md-10 col-lg-8">
                        <Row>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label
                                        className="form-label">
                                        Old MasterPass
                                    </Form.Label>
                                    <Form.Control
                                        className="input-background"
                                        value={masterPass}
                                        onChange={(e) => setMasterPass(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label
                                        className="form-label">
                                        New MasterPass
                                    </Form.Label>
                                    <Form.Control
                                        className="input-background"
                                        value={newMasterPass}
                                        onChange={(e) => setNewMasterPass(e.target.value)}
                                    />
                                </Form.Group>
                                <br />
                                <Button
                                    className="col-12 menuBtn"
                                    onClick={handleShow}>
                                    Submit
                                </Button>
                            </Card.Body>

                        </Row>
                    </Card>

                </Row>
                <center>
                    <br />

                </center>
            </Container>
        </>
    )
}
export default PassReset