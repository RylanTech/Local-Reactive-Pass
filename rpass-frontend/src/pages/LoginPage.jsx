import { useContext, useState } from 'react'
import { Button, Card, Container, Form, Row } from 'react-bootstrap'
import { UserContext } from '../contexts/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'
import ClipLoader from 'react-spinners/ClipLoader'

function Loginpage() {
    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [token, setToken] = useState("");
    const [message, setMessage] = useState()
    const [awaitingLogin, setAwaitingLogin] = useState(false)

    const { login } = useContext(UserContext)
    const navigate = useNavigate()

    async function handleSubmit() {
        try {
            setAwaitingLogin(true)
            if (email !== undefined && password !== undefined) {
                let credentials = {
                    email,
                    password,
                    token
                }
                let res = await login(credentials)
                if (res.data.success === true) {
                    navigate('/')
                } else if (res.data.success === false) {
                    setMessage(res.data.type)
                    setAwaitingLogin(false)
                }
            } else {
                setMessage("Please make sure all fields are filled")
                setAwaitingLogin(false)
            }
        } catch {
            navigate('/login')
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
                    <div className='col-md-2 col-lg-4' />
                    <Card className='col-12 col-md-8 col-lg-4 container-card'>
                        <Card.Body>
                            <Row>
                                <div className='col-3' />
                                <img className='loginPhoto col-6'
                                    src='reactive_pass_lettermark.svg'
                                    alt='rpass' />
                                <div className='col-3' />
                                <br />
                                <Form.Group>
                                    <Form.Label
                                        className='login-form-label'>
                                        Email
                                    </Form.Label>
                                    <Form.Control
                                        value={email}
                                        onChange={(e) => handleSetEmail(e.target.value)}
                                        className='input-background login-form-background'
                                    />
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Form.Label
                                        className='login-form-label'
                                    >Password
                                    </Form.Label>
                                    <Form.Control
                                        type='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='input-background login-form-background'
                                    />
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Form.Label
                                        className='login-form-label'>2FA key (Optional)</Form.Label>
                                    <Form.Control
                                        type='token'
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        className='input-background login-form-background'
                                    />
                                </Form.Group>
                            </Row>
                            <br />
                            <Row>
                                {awaitingLogin ? (
                                    <>
                                        <Link>
                                            <div className='col-md-2' />
                                            <Button
                                                className='col-12 menuBtn'>
                                                <ClipLoader
                                                    color="#fff"
                                                    className="loadingInMenuBtn" />
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link>
                                            <div className='col-md-2' />
                                            <Button
                                                onClick={handleSubmit}
                                                className='col-12 menuBtn'
                                            >Login</Button>
                                        </Link>
                                    </>
                                )}
                            </Row>
                            <Row>
                                <div className='col-md-2' />
                                <Link
                                    to={'/create-account'}
                                    className='col-12'>
                                    <Button
                                        className='col-12 create-account-button'
                                    >Create an Account</Button>
                                </Link>
                            </Row>
                        </Card.Body>
                    </Card>
                </Row>
                <center>
                    <br />
                    <Row>
                        <div className='col-12 col-md-2 col-lg-4' />
                        {message ? (
                            <>
                                <div className='message col-12 col-md-8 col-lg-4'>
                                    {message}
                                </div>
                                <br />
                            </>
                        ) : (
                            <>
                            </>
                        )}
                    </Row>
                </center>
            </Container>
        </>
    )
}
export default Loginpage