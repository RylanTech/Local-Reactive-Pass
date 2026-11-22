import { useContext, useEffect, useState } from "react"
import { PassContext } from "../contexts/PassContext"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, Container, Form, Modal, Row } from "react-bootstrap"
import './PassPage.css'

function PassPage() {
    const [pass, setPass] = useState()
    const [show, setShow] = useState(false);
    const [show2, set2Show] = useState(false)
    const [masterPass, setMasterPass] = useState("")
    const [message, setMessage] = useState()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handle2Close = () => set2Show(false);
    const handle2Show = () => set2Show(true);

    const { getPass, deletePass } = useContext(PassContext)
    const params = useParams()
    const navigate = useNavigate()
    const passName = params.name

    useEffect(() => {
        handleShow()
    }, [])

    async function handleSubmit() {
        let pass = await getPass(passName, masterPass)
        console.log(pass)
        if (pass === false) {
            setMessage("Incorrect Password")
        } else {
            setPass(pass)
            handleClose()
        }
    }

    function handleDelete() {
        handle2Show()
    }

    function delPass() {
        console.log(pass.passId)
        deletePass(pass.passId)
        navigate('/')
    }

    function copyToClipboard(text) {
        // Create a temporary textarea element
        var textarea = document.createElement("textarea");
        // Set the text content to the input text
        textarea.value = text;
        // Make sure to make it non-editable
        textarea.setAttribute("readonly", "");
        // Hide the textarea to ensure it doesn't disrupt the page layout
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        // Append the textarea to the body
        document.body.appendChild(textarea);
        // Select the text in the textarea
        textarea.select();
        // Copy the selected text to the clipboard
        document.execCommand("copy");
        // Remove the textarea from the DOM
        document.body.removeChild(textarea);
        // Optionally, you can provide feedback to the user that the text has been copied
        alert("Text copied to clipboard: " + text);
    }

    function goThroughStuff() {
        return (
            <>
                {pass.email ? (
                    <>
                        <div className="col-12">
                            <Row>
                                <div className="col-4 form-label">
                                    Email:
                                </div>
                                <div className="col-8">
                                    <Form.Group>
                                        <Form.Control
                                            className="col-12 input-background"
                                            value={pass.email}
                                            onClick={() => copyToClipboard(pass.email)}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                            </Row>
                        </div>
                    </>
                ) : (
                    <></>
                )}
                {pass.username ? (
                    <>
                        <div
                            className="col-12">
                            <br />
                            <Row>
                                <div
                                    className="col-4 form-label">
                                    Username:
                                </div>
                                <div className="col-8">
                                    <Form.Group>
                                        <Form.Control
                                            className="col-12 input-background"
                                            value={pass.username}
                                            onClick={() => copyToClipboard(pass.username)}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                            </Row>
                        </div>
                    </>
                ) : (
                    <></>
                )}
                {pass.password ? (
                    <>
                        <div className="col-12">
                            <br />
                            <Row>

                                <div className="col-4 form-label">
                                    Password:
                                </div>
                                <div className="col-8">
                                    <Form.Group>
                                        <Form.Control
                                            className="col-12 input-background"
                                            value={pass.password}
                                            onClick={() => copyToClipboard(pass.password)}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                            </Row>
                        </div>
                    </>
                ) : (
                    <></>
                )}
                {pass.twoFactorKey ? (
                    <>
                        <div className="col-12">
                            <br />
                            <Row>
                                <div className="col-4 form-label">
                                    2FA Key:
                                </div>
                                <div className="col-8">
                                    <Form.Group>
                                        <Form.Control
                                            className="col-12 input-background"
                                            value={pass.twoFactorKey}
                                            onClick={() => copyToClipboard(pass.twoFactorKey)}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                            </Row>
                        </div>
                    </>
                ) : (
                    <></>
                )}
                {pass.otherNotes ? (
                    <>

                        <Form.Group>
                            <br />
                            <Row>
                                <div className="col-12 form-label">
                                    Other Notes
                                </div>
                            </Row>
                            <Form.Control
                                as="textarea"
                                value={pass.otherNotes}
                                className="col-12 input-background"
                                rows={3}
                                readOnly />
                        </Form.Group>

                    </>
                ) : (
                    <></>
                )}
                {pass.serviceName ? (
                    <>
                        <Link
                            className="col-12"
                            to={`/edit/${passName}`}>
                            <Button
                                className="editBtn col-12"
                            >Edit
                            </Button>
                        </Link>
                        <div className="col-12">
                            <Button
                                className="removeBtn removePassBtn col-12"
                                onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </>
        )
    }


    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}>
                <Modal.Header
                    className="popup-model">
                    <Modal.Title>Master Password</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="popup-model">
                    <div>
                        {message ? (
                            <>
                                <div className="col-12 message">
                                    {message}
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
                        <Button className="popup-model-close">
                            Close
                        </Button>
                    </Link>
                    <Button
                        onClick={handleSubmit}
                        className="menuBtn">
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show2} onHide={handle2Close}>
                <Modal.Header
                    className="popup-model">
                    <Modal.Title>Delete Pass</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="popup-model">
                    <div>
                        Are you sure you want to delete this pass?
                    </div>
                </Modal.Body>
                <Modal.Footer
                    className="popup-model"
                >
                    <Button
                        onClick={handle2Close}
                        className="popup-model-close">
                        Close
                    </Button>
                    <Button
                        className="removeBtn"
                        onClick={delPass}>
                        Delete
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
                    {pass ? (
                        <>
                            <div className="col-md-1 col-lg-2 col-xl-3" />
                            <Card className="container-card col-12 col-md-10 col-lg-8 col-xl-6">
                                <Card.Body>
                                    <Form>
                                        <Row>
                                            {goThroughStuff()}
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </>
                    ) : (
                        <></>
                    )}
                </Row>
            </Container>
        </>
    )
}
export default PassPage