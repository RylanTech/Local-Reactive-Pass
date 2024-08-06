import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { Link, useNavigate } from "react-router-dom"
import { Button, Container, Form, Modal, Row } from "react-bootstrap"
import { PassContext } from "../contexts/PassContext"
import ClipLoader from "react-spinners/ClipLoader";
import './HomePage.css'

function Homepage() {
    const [passes, setPasses] = useState()
    const [searchArr, setSearchArr] = useState()
    const [show, setShow] = useState()
    const [secondShow, setSecondShow] = useState()
    const [thirdShow, setThirdShow] = useState()
    const [fourthShow, setFourthShow] = useState();
    const [status, setTwoFactorStatus] = useState()
    const [remove2faPassword, setRemove2faPassword] = useState("")
    const [add2faPassword, setAdd2faPassword] = useState("")
    const [twoFactorSecret, setTwoFactorSecret] = useState("")
    const [test2faToken, setTest2faToken] = useState("")
    const [message, setMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [addTwoFactorMessage, setAddTwoFactorMessage] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const secondHandleClose = () => setSecondShow(false);
    const secondHandleShow = () => setSecondShow(true);

    const thirdHandleClose = () => setThirdShow(false);
    const thirdHandleShow = () => setThirdShow(true);

    const fourthHandleClose = () => setFourthShow(false);
    const fourthHandleShow = () => setFourthShow(true);

    const { verify, twoFactorStatus, deleteTwoFactor, addTwoFactor, testTwoFactor } = useContext(UserContext)
    const { getPasses, searchPasses } = useContext(PassContext)
    const navigate = useNavigate()

    useEffect(() => {
        async function startup() {
            let res = await verify()
            if (!res) {
                navigate('/login')
            }

            try {
                let passes = await getPasses();
                setPasses(passes);

                let status = await twoFactorStatus()
                setTwoFactorStatus(status)

            } catch {
                navigate('/login')
            }
        }
        startup()
    }, [getPasses, navigate, twoFactorStatus, verify])

    async function handleChange(e) {
        if (!e.target.value) {
            setSearchArr(null)
        } else {
            let services = await searchPasses(e.target.value)
            setSearchArr(services)
        }
    }

    function handle2faRemove() {
        handleClose()
        secondHandleShow()
    }

    function handleDelete2fa() {
        const masterPass = {
            masterPass: remove2faPassword
        }
        deleteTwoFactor(masterPass).then(() => {
            secondHandleClose()
        })
        setTwoFactorStatus(false)
    }

    function handle2faAdd() {
        handleClose()
        thirdHandleShow()
    }

    function handleLogout() {
        localStorage.clear('rpassToken')
        window.location.reload()
    }



    async function handleAdd2fa() {
        const masterPass = {
            masterPass: add2faPassword
        }
        const secret = await addTwoFactor(masterPass)
        if (secret.auth === true) {
            thirdHandleClose()
            setTwoFactorSecret(secret.key)
            fourthHandleShow()
            setAddTwoFactorMessage()
        } else {
            setAddTwoFactorMessage("Wrong MasterPass")
        }
    }

    async function testingTwoFactor() {
        const token = {
            token: test2faToken
        }
        let results = await testTwoFactor(token)
        if (results === true) {
            setMessage(null)
            setSuccessMessage("Success! 2FA is set up!")
        } else if (results === false) {
            setSuccessMessage(null)
            setMessage("Something went wrong, please try again. If this keeps happening, close this prompt, delete 2FA in the menu and then start over.")
        }
    }

    function copyToClipboard(text) {
        // Create a new asynchronous clipboard write promise
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text successfully copied to clipboard');
            })
            .catch(err => {
                console.error('Unable to copy text to clipboard', err);
            });
    }

    function mapThroughSearches() {
        if (searchArr) {
            return searchArr.map((title, index) => {
                const marginTop = index * 40; // Calculate margin-top based on index

                return (
                    <div className="col-12" key={index}>
                        <Link to={`/pass/${title}`}>
                            <div className="col-8 searchBox" style={{ marginTop: `${marginTop}px` }}>
                                <h3>{title}</h3>
                            </div>
                        </Link>
                    </div>
                );
            });
        }
    }

    function mapThroughPasses() {
        if (passes) {
            if (passes.length > 0) {
                return passes.map((pass) => {
                    return (
                        <div className="col-12 col-md-6" key={pass}>
                            <Link className="textNone" to={`/pass/${pass}`}>
                                <div className="col-12 box">
                                    <center>
                                        <h3>{pass}</h3>
                                    </center>
                                </div>
                            </Link>
                        </div>
                    )
                })
            } else {
                return (
                    <>
                        <center>
                            <br />
                            <h3
                                className="text-color">
                                Hello there!
                            </h3>
                            <div
                                className="text-color">
                                Go ahead and click the menu to create a pass. It is also recommended to set up 2FA.
                            </div>
                        </center>
                    </>
                )
            }
        } else {
            return (
                <>
                    <div className="col-12">
                        <center>
                            <br />
                            <ClipLoader
                                color="#fff"
                                size={150}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </center>
                    </div>
                </>
            )
        }
    }

    return (
        <>
            <Modal
                show={fourthShow}
                onHide={fourthHandleClose}>
                <Modal.Header
                    className="popup-model">
                    <Modal.Title>
                        <b>
                            Verify 2FA
                        </b>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="popup-model">
                    <Form>
                        <Form.Group className="col-12">
                            <Form.Label>2FA Secret</Form.Label>
                            <Form.Control
                                className="input-background"
                                value={twoFactorSecret}
                            />
                        </Form.Group>
                        <center>
                            <Button
                                className="col-3 menuBtn"
                                onClick={() => copyToClipboard(twoFactorSecret)}>
                                Copy
                            </Button>
                            <br /><br />
                        </center>
                    </Form>
                    <div>Take the 2FA secret and put it inside of an authenticator app (like google authenticator). From there, take the 6 digit code in the authenticator app and put it in the 2FA Token input below</div>
                    <br />
                    {message ? (
                        <>
                            <div className="message">{message}</div>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                    {successMessage ? (
                        <>
                            <div className="successMessage">{successMessage}</div>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                    <br />
                    <Form>
                        <Form.Group>
                            <Form.Label>2FA Token</Form.Label>
                            <Form.Control
                                className="input-background"
                                value={test2faToken}
                                onChange={(e) => setTest2faToken(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <center>
                        <Button
                            className="col-3 menuBtn"
                            onClick={testingTwoFactor}>
                            Test 2FA
                        </Button>
                    </center>
                </Modal.Body>
                <Modal.Footer
                    className="popup-model">
                    <Button
                        onClick={fourthHandleClose}
                        className="popup-model-close">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={thirdShow}
                onHide={thirdHandleClose}>
                <Modal.Header
                    className="popup-model">
                    <Modal.Title><b>Add 2FA</b></Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="popup-model">
                    <Form>
                        <Form.Group>
                            <Form.Label>MasterPass</Form.Label>
                            <Form.Control
                                className="input-background"
                                value={add2faPassword}
                                type="password"
                                onChange={(e) => setAdd2faPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <div>
                        <br />
                        2FA can be removed and added with the masterPass, but you will need a 2FA key to login.
                    </div>
                    {addTwoFactorMessage ? (
                        <>
                            <br />
                            <div className="message">
                                <center>
                                    {addTwoFactorMessage}
                                </center>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </Modal.Body>
                <Modal.Footer
                    className="popup-model">
                    <Button
                        onClick={thirdHandleClose}
                        className="popup-model-close">
                        Cancel
                    </Button>
                    <Button
                        className="menuBtn"
                        onClick={handleAdd2fa}>
                        Add 2FA
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={secondShow}
                onHide={secondHandleClose}>
                <Modal.Header closeButton
                    className="popup-model">
                    <Modal.Title><b>Remove 2FA</b></Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="popup-model">
                    <Form>
                        <Form.Group>
                            <Form.Label>MasterPass</Form.Label>
                            <Form.Control
                                className="input-background"
                                value={remove2faPassword}
                                type="password"
                                onChange={(e) => setRemove2faPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer
                    className="popup-model">

                    <Button
                        onClick={secondHandleClose}
                        className="popup-model-close">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete2fa}
                        className="removeBtn">
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header className="popup-model col-12">
                    <div className="col-8">
                        <Modal.Title>
                            <Row>
                                <div className="wordmark-area col-8">
                                    <img
                                        alt="Reactive Pass wordmark"
                                        className="col-12"
                                        src="reactive_pass_wordmark_alt.svg" />
                                </div>
                            </Row>
                        </Modal.Title>
                    </div>
                    <Button
                        onClick={handleClose}
                        className="popup-model-close col-3">
                        Close
                    </Button>

                </Modal.Header>
                <Modal.Body className="popup-model">
                    <Link className="textNone" to={'/create'}>
                        <div>
                            <div className="col-12 box">
                                <center>
                                    <h3>Create Pass</h3>
                                </center>
                            </div>
                        </div>
                    </Link>
                    <Link className="textNone" to={'/reset'}>
                        <div>
                            <div className="col-12 box">
                                <center>
                                    <h3>Reset Master Pass</h3>
                                </center>
                            </div>
                        </div>
                    </Link>
                    {status ? (
                        <>
                            <div className="col-12 box" onClick={handle2faRemove}>
                                <center>
                                    <h3>Remove 2FA</h3>
                                </center>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="col-12 box" onClick={handle2faAdd}>
                                <center>
                                    <h3>Add 2FA</h3>
                                </center>
                            </div>
                        </>
                    )}
                    <div className="box col-12" onClick={handleLogout}>
                        <center>
                            <h3>Logout</h3>
                        </center>
                    </div>
                    <div className="text-color">
                        <br/>
                        <center>
                            Contact: Rylan@Reactivepass.com
                        </center>
                    </div>
                </Modal.Body>
            </Modal>
            <div className="searchNav">
                <Container>
                    <Row>
                        <Form.Group
                            className="col-9 searchBar">
                            <Form.Control
                                className="custom-form-control"
                                onChange={handleChange}
                            />
                            {searchArr ? (
                                <>
                                    <Row>
                                        <Container>
                                            <Row>
                                                {mapThroughSearches()}
                                            </Row>
                                        </Container>
                                    </Row>
                                </>
                            ) : (
                                <></>
                            )}
                        </Form.Group>
                        <div className="col-3">
                            <center>
                                <Button
                                    className="menuBtn col-12"
                                    onClick={handleShow}
                                >
                                    Menu
                                </Button>
                            </center>
                        </div>
                    </Row>
                </Container>
            </div>
            <Container>
                <Row>
                    {mapThroughPasses()}
                </Row>
            </Container>
        </>
    )
}
export default Homepage