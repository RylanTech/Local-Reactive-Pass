import { useContext, useState } from "react"
import { Button, Card, Container, Form, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext";
import ClipLoader from "react-spinners/ClipLoader";

function CreateAccount() {
    const navigate = useNavigate()

    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [secondPassword, setSecondPassword] = useState(undefined)
    const [name, setName] = useState(undefined);
    const [message, setMessage] = useState();
    const [passNotTheSame, setPassNotTheSame] = useState(false)
    const [awaitingServer, setAwaitingServer] = useState(false)

    const { createAccount } = useContext(UserContext)

    async function handleSubmit() {
        setAwaitingServer(true)
        let newAcc
        if (name !== undefined && password !== undefined && secondPassword !== undefined && email !== undefined) {
            let user = {
                email: email,
                name: name,
                password: password,
            }
            newAcc = await createAccount(user)

            if (newAcc.email && newAcc.userId) {
                navigate("/login")
            } else {
                setMessage("An error occoured while connecting to the server")
            }
        } else {
            setMessage("Please make sure all fields are filled")
            setAwaitingServer(false)
        }
    }

    function checkPasswordsMatchOne(value) {
        console.log(value.length)
        if (secondPassword && value !== secondPassword) {
            setPassNotTheSame("Passwords do not match")
        } else if (value.length < 10) {
            setPassNotTheSame("Password must be at least 10 characters")
        } else if (value !== secondPassword) {
            setPassNotTheSame("Passwords do not match")
        } else {
            setPassNotTheSame(false)
        }
    }

    function checkPasswordsMatchTwo(value) {
        if (password[0] && value !== password) {
            setPassNotTheSame("Passwords do not match")
        } else if (value.length < 10) {
            setPassNotTheSame("Password must be at least 10 characters")
        } else if (value !== password) {
            setPassNotTheSame("Passwords do not match")
        } else {
            setPassNotTheSame(false)
        }
    }

    function handleSetEmail(value) {
        value = value.toLowerCase()
        setEmail(value)
    }


    return (
        <>
            <Container>
                <br />
                <Row>
                    <div
                        className="col-md-1 col-lg-2" />
                    <Card
                        className="col-12 col-md-10 col-lg-8 container-card">
                        <br />
                        <div
                            className='col-md-2' />
                        <div className='col-12'>
                            <Row>
                                <div className="col-md-2" />
                                <div className="col-12 col-md-8">
                                    <Row>
                                        <Form.Group>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                value={name}
                                                className="input-background"
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                value={email}
                                                className="input-background"
                                                onChange={(e) => handleSetEmail(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-lg-6">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type='password'
                                                value={password}
                                                className="input-background"
                                                onChange={(e) => {
                                                    setPassword(e.target.value)
                                                    checkPasswordsMatchOne(e.target.value)

                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-lg-6">
                                            <Form.Label>Re-Type Password</Form.Label>
                                            <Form.Control
                                                type='password'
                                                className="input-background"
                                                value={secondPassword}
                                                onChange={(e) => {
                                                    setSecondPassword(e.target.value)
                                                    checkPasswordsMatchTwo(e.target.value)
                                                }}
                                            />
                                        </Form.Group>
                                    </Row>
                                </div>
                                <div className="col-md-2" />
                            </Row>
                        </div>
                        <br />
                        <Row>
                            <div className="col-md-2" />
                            {passNotTheSame ? (
                                <div className="col-12 col-md-8">
                                    <div className="col-12 message">
                                        <center>
                                            {passNotTheSame}
                                        </center>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link className="col-12 col-md-8">
                                        {awaitingServer ? (
                                            <>
                                                <Button
                                                    className='col-12 menuBtn CreateAccountMarginBalanceBtn'>
                                                    <ClipLoader
                                                        color="#fff"
                                                        className="loadingInMenuBtn" />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    onClick={handleSubmit}
                                                    className='col-12 menuBtn CreateAccountMarginBalanceBtn'
                                                >
                                                    Create an Account
                                                </Button>
                                            </>
                                        )}
                                    </Link>
                                </>
                            )}
                            <div className="col-md-2" />
                        </Row>
                        <Row>
                            <div className='col-md-2' />
                        </Row>
                        <Row>
                            <div className='col-md-2' />
                            <Link
                                to={'/login'}
                                className='col-12 col-md-8'>
                                <Button
                                    className='col-12 create-account-button '
                                >Already have an account? Login</Button>
                            </Link>
                            <div className='col-md-2' />
                        </Row>
                        <br />
                    </Card>
                    <div className="col-md-1 col-lg-2" />
                </Row>

                <center>
                    <br />
                    <Row>
                        <div className='col-md-2' />
                        <div className='col-12 col-md-8'>
                            {message ? (
                                <>
                                    <div className='message'>
                                        {message}
                                    </div>
                                    <br />
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </div>
                    </Row>
                </center>
            </Container>
        </>
    )
}
export default CreateAccount