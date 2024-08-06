import { useContext, useEffect, useState } from "react"
import { Button, Card, Container, Form, Modal, Row } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { PassContext } from "../contexts/PassContext"

function EditPassPage() {
    const [serviceName, setServiceName] = useState()
    const [email, setEmail] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [twoFactorKey, setTwoFactorKey] = useState()
    const [otherNotes, setOtherNotes] = useState()
    const [passId, setPassId] = useState()
    const [masterPass, setMasterPass] = useState()
    const [message, setMessage] = useState()
    const [popupMessage, setPopupMessage] = useState()
    const [show, setShow] = useState()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { editPass, getPass } = useContext(PassContext)
    const navigate = useNavigate()
    let params = useParams()

    useEffect(() => {
        handleShow()
    }, [])

    async function handleSubmit() {
        const pass = {
            serviceName: serviceName,
            email: email,
            username: username,
            password: password,
            twoFactorKey: twoFactorKey,
            otherNotes: otherNotes,
            masterPass: masterPass
        }

        let res = await editPass(pass, passId)
        if (res === true) {
            navigate("/")
        } else {
            setMessage("Incorrect Master Password")
        }
    }

    async function handleGet() {
        let pass = await getPass(params.name, masterPass)

        if (pass) {
            setEmail(pass.email)
            setOtherNotes(pass.otherNotes)
            setPassword(pass.password)
            setUsername(pass.username)
            setServiceName(pass.serviceName)
            setTwoFactorKey(pass.twoFactorKey)
            setPassId(pass.passId)

            handleClose()
        } else {
            setPopupMessage("Incorrect Master Password")
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header
                    className="popup-model">
                    <Modal.Title>Master Password</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="popup-model">
                    <div>
                        {popupMessage ? (
                            <>
                                <div className="col-12 message">
                                    {popupMessage}
                                </div>
                                <br />
                            </>
                        ) : (
                            <></>
                        )}
                        <Form.Control
                            className="input-background"
                            type="password"
                            value={masterPass}
                            onChange={(e) => setMasterPass(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer
                    className="popup-model">
                    <Link to={"/"}>
                        <Button
                            className="popup-model-close">
                            Close
                        </Button>
                    </Link>
                    <Button
                        className="menuBtn"
                        onClick={handleGet}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            <div
                className="searchNav">
                <Container>
                    <Row className="align-items-center">
                        <div className="col-4 col-md-3 col-lg-2 wordmark-area">
                            <img 
                            alt="Reactive Pass wordmark"
                            src="/reactive_pass_wordmark_alt.svg" 
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
                <div className="col-md-1 col-lg-2 col-xl-3" />
                    <Card className="container-card col-12 col-md-10 col-lg-8 col-xl-6">
                        <Form>
                            <Form.Group>
                                <br />
                                <Row>
                                    <div className="col-4 form-label">
                                        Service Name
                                    </div>
                                    <div className="col-8">
                                        <Form.Control
                                            className="input-background"
                                            placeholder="Required"
                                            value={serviceName}
                                            onChange={(e) => setServiceName(e.target.value)}
                                        />
                                    </div>
                                </Row>
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Row>
                                    <div className="col-4 form-label">
                                        Email
                                    </div>
                                    <div className="col-8">
                                        <Form.Control
                                            className="input-background"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </Row>

                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Row>
                                    <div className="col-4 form-label">
                                        Username
                                    </div>
                                    <div className="col-8">
                                        <Form.Control
                                            className="input-background"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </Row>

                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Row>
                                    <div className="col-4 form-label">
                                        Password
                                    </div>
                                    <div className="col-8">
                                        <Form.Control
                                            className="input-background"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </Row>

                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Row>
                                    <div className="col-4 form-label">
                                        Two Factor Key
                                    </div>
                                    <div className="col-8">
                                        <Form.Control
                                            className="input-background"
                                            value={twoFactorKey}
                                            onChange={(e) => setTwoFactorKey(e.target.value)}
                                        />
                                    </div>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <br />
                                <Row>

                                    <div className="col-12 form-label">
                                        Other Notes
                                    </div>
                                    <div className="col-12">
                                        <Form.Control
                                            rows={3}
                                            as="textarea"
                                            className="input-background col-12"
                                            value={otherNotes}
                                            onChange={(e) => setOtherNotes(e.target.value)}
                                        />
                                    </div>
                                </Row>
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Row>
                                    {message ? (
                                        <>
                                            <div>
                                                <br />
                                            </div>
                                            <div>
                                                <div className="message col-12">
                                                    {message}
                                                </div>
                                            </div>
                                            <div>
                                                <br />
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    <div
                                        className="col-4 form-label">
                                        Master Password
                                    </div>
                                    <div className="col-8">
                                        <Form.Control
                                            className="input-background"
                                            type="password"
                                            value={masterPass}
                                            onChange={(e) => setMasterPass(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <Button
                                            className="col-12 editBtn"
                                            onClick={handleSubmit}
                                        >Save & Encrypt
                                        </Button>
                                    </div>
                                </Row>
                                <br />
                            </Form.Group>
                        </Form>
                    </Card>
                </Row>
                <br />
                <Row>
                </Row>
            </Container>
        </>
    )
}
export default EditPassPage