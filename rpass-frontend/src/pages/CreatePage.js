import { useContext, useState } from "react"
import { Button, Card, Container, Form, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { PassContext } from "../contexts/PassContext"

function CreatePage() {
    const [serviceName, setServiceName] = useState()
    const [email, setEmail] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [twoFactorKey, setTwoFactorKey] = useState()
    const [otherNotes, setOtherNotes] = useState()
    const [masterPass, setMasterPass] = useState()
    const [message, setMessage] = useState(null)

    const { createPass } = useContext(PassContext)
    const navigate = useNavigate()

    function settingServiceName(value) {
        if (value.includes('/') || value.includes('\\')) {

        } else {
            setServiceName(value);
        }
    }

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

        let res = await createPass(pass)
        console.log(res)

        if (res.success === true) {
            setMessage(undefined)
            navigate("/")
        } else {
            setMessage(res.message)
        }
    }

    return (
        <>
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
            <br/>
                <Row>
                    <div className="col-md-1 col-lg-2 col-xl-3"/>
                    <Card className="container-card col-12 col-md-10 col-lg-8 col-xl-6">
                        <Card.Body>
                            <Row>
                                <div className="formBox">
                                    <Form>
                                        <Form.Group>

                                            <Row>
                                                <div
                                                    className="col-4 form-label">
                                                    Service Name
                                                </div>
                                                <div
                                                    className="col-8">
                                                    <Form.Control
                                                        className="input-background"
                                                        placeholder="Required"
                                                        value={serviceName}
                                                        name="Service Name"
                                                        onChange={(e) => settingServiceName(e.target.value)}
                                                    />
                                                </div>
                                            </Row>
                                        </Form.Group>
                                        <br />
                                        <Form.Group>
                                            <Row>
                                                <div
                                                    className="col-4 form-label">
                                                    Email
                                                </div>
                                                <div className="col-8">
                                                    <Form.Control
                                                        className="input-background"
                                                        value={email}
                                                        name="Email"
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
                                                        name="username"
                                                        onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                </div>
                                            </Row>
                                        </Form.Group>
                                        <br />
                                        <Form.Group>
                                            <Row>
                                                <div
                                                    className="col-4 form-label">
                                                    Password
                                                </div>
                                                <div
                                                    className="col-8">
                                                    <Form.Control
                                                        className="input-background"
                                                        value={password}
                                                        name="service password"
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                            </Row>
                                        </Form.Group>
                                        <br />
                                        <Form.Group>
                                            <Row>
                                                <div className="col-4 form-label">
                                                    2FA key
                                                </div>
                                                <div className="col-8">
                                                    <Form.Control
                                                        name="2fa key"
                                                        className="input-background"
                                                        value={twoFactorKey}
                                                        onChange={(e) => setTwoFactorKey(e.target.value)}
                                                    />
                                                </div>
                                            </Row>
                                        </Form.Group>
                                        <br />
                                        <Form.Group>
                                            <Row>
                                                <div className="col-12 col-md-4 form-label">
                                                    Other Notes
                                                </div>
                                            <div className="col-12 col-md-8">
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
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
                                                <div className="col-4 form-label">
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

                                            </Row>
                                        </Form.Group>
                                        <br />
                                        <Button
                                            onClick={handleSubmit}
                                            className="col-12 menuBtn"
                                        >Save & Encrypt</Button>
                                    </Form>
                                    {message ? (
                                        <>
                                            <br />
                                            <div className="col-12 message">
                                                {message}
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </Row>
                        </Card.Body>
                    </Card>
                </Row>
                <br/>
            </Container>
        </>
    )
}
export default CreatePage