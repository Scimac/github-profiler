import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Image, Row, Stack } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';

function DetailScreen() {
    const location = useLocation();
    const searchQuery = useParams();
    const [usersList, setUsersList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isUserDetailOpen, setisUserDetailOpen] = useState(false);

    const handleSearchUser = (userQuery) => {
        // https://api.github.com/search/users?q={query}{&page,per_page,sort,order}
        if (userQuery && userQuery.length > 1) {
            fetch(`https://api.github.com/search/users?q=${userQuery}&page=0&per_page=20`)
            .then(response => response.json())
            .then( data => {
                console.log(data);
                setUsersList(data.items);
            });
        }
    }

    const simulateService = (userQuery) => {
        // https://api.github.com/search/users?q={query}{&page,per_page,sort,order}
        if (userQuery && userQuery.length > 1) {
            fetch('/model/data.json')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setUsersList(data.items);
                    setTotalCount(data.total_count);
                });
        }
    }

    const fetchMoreDetails = () => {
        setisUserDetailOpen(true);
        debugger;
    }

    const renderUsersListItem = (user) => {
        // debugger;
        return <Stack key={user.id} className='userRowClass p-2 m-3' direction='horizontal' gap={5} >
            <Image thumbnail src={user.avatar_url} width={100} />
            <div className="vr" />
            <Stack direction='vertical'>
                <h4 className='userTitle'>{user.login}</h4>
                <Stack direction='horizontal' gap={3} >
                    <a className='userLinks userGithubLink' href={user.html_url} target='_blank'>Github profile</a>
                    <div className="vr" />
                    <a className='userLinks' onClick={fetchMoreDetails} >More Details</a>
                </Stack>
            </Stack>
        </Stack>
    }
    
    const UsersNotFound = () => {
        return <div style={{color : 'whitesmoke'}} >Users not found</div>
    }
    
    const UserDetails = () => {
        return <div style={{color : 'whitesmoke'}}>show user details</div>
    }

    useEffect(() => {
        console.log(location, searchQuery);
        handleSearchUser(location.state.searchUserQuery);
        // simulateService(location.state.searchUserQuery);
    }, [])

    return (
        <Container>
            <Row>
                <Col>
                {usersList.length > 0 ? usersList.map((user) => renderUsersListItem(user)) : <UsersNotFound />}
                </Col>
                {isUserDetailOpen && <UserDetails />}
            </Row>
        </Container>
    )
}

export default DetailScreen;