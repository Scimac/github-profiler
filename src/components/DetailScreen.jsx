import React, { useContext, useEffect, useState } from 'react'
import { CloseButton, Col, Container, Image, Row, Stack } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';

const formatDate = (date) => {
    let res = 'Updated on'
    if (date) {
        let parsedDateArray = new Date(date).toDateString().split(' ');
        res = `${res} ${parsedDateArray.slice(1,3)}, ${parsedDateArray[3]}`
    }

    return res;
} 

function DetailScreen() {
    const location = useLocation();
    const searchQuery = useParams();
    const [userData, setUserData] = useState({});
    const [userRepos, setUserRepos] = useState({});
    const [usersList, setUsersList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isUserDetailOpen, setisUserDetailOpen] = useState(false);

    const handleSearchUser = (userQuery) => {
        // https://api.github.com/search/users?q={query}{&page,per_page,sort,order}
        if (userQuery && userQuery.length > 1) {
            fetch(`https://api.github.com/search/users?q=${userQuery}&page=0&per_page=20`)
                .then(response => response.json())
                .then(data => {
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

    const fetchUserData = (userLoginId) => {
        Promise.all(
            [fetch(`https://api.github.com/users/${userLoginId}`)
                .then(response => response.json()),
            fetch(`https://api.github.com/users/${userLoginId}/repos`)
                .then(response => response.json())]
        ).then(([userData, reposData]) => {
            setUserRepos(reposData);
            setUserData(userData);
            setisUserDetailOpen(true);
        });
    }

    // const fetchMoreDetails = (evt) => {
    //     let userLoginId = '';
    //     debugger;
    //     ;
    // }

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
                    <a className='userLinks' onClick={(e) => fetchUserData(user.login)} >More Details</a>
                </Stack>
            </Stack>
        </Stack>
    }

    const renderRepo = (userRepo) => {
        return <Stack key={userRepo.id} className="repoListItem" direction='vertical'>
            <a href={userRepo.html_url} target='_blank'>{userRepo.full_name}</a>
            <span className='repoDescpClass'>{userRepo.description ?? '  '}</span>
            <Stack className='repoInfoItems' direction='horizontal'>
                {userRepo.language && <span className='repoInfoItemClass'>
                    <img src='/resources/lang.png' width={'20px'} className='me-1' ></img>
                    {userRepo.language}
                </span>}
                {userRepo.updated_at && <span className='repoInfoItemClass'>
                    {formatDate(userRepo.updated_at)}
                </span>}
                {userData.stargazers_count && <span className='infoItemClass mt-2'>
                    <img src='/resources/star.png' width={'20px'} className='me-1' ></img>
                    {userData.stargazers_count}
                </span>}
                {userData.watchers_count && <span className='infoItemClass mt-2'>
                    <img src='/resources/eye.png' width={'20px'} className='me-1' ></img>
                    {userData.watchers_count}
                </span>}
                {userData.license && <a href={userData.license?.url} target='_blank' className='infoItemClass mt-2'>
                    <img src='/resources/license.png' width={'20px'} className='me-1' ></img>
                    {userData.license?.name}
                </a>}
            </Stack>
        </Stack>
    }

    const UsersNotFound = () => {
        return <div style={{ color: 'whitesmoke' }} >Users not found</div>
    }

    const ReposNotFound = () => {
        return <div style={{ color: 'whitesmoke' }} >Repos not found</div>
    }

    const UserDetails = () => {
        return <div className='Col detailPageClass' style={{ color: 'whitesmoke', width: '50%' }}>
            <CloseButton className='closeBtnClass' variant="white" onClick={() => setisUserDetailOpen(false)}></CloseButton>
            <Row className='headerFlexClass' >
                <Image thumbnail src={userData.avatar_url} className='detailPageImg' width={100} />
                <Col>
                    <div>
                        <span className='detailTitleClass'>{userData.name}</span> aka <span className='aliasClass'>{userData.login}</span>
                    </div>
                    <span className='userBioClass mb-2'>{userData.bio}</span>
                    <Row className='detailClass'>
                        {userData.email && <span className='infoItemClass mt-2'>
                            <img src='/resources/mail.png' width={'20px'} className='me-2' ></img>
                            {userData.email}
                        </span>}
                        {userData.location && <span className='infoItemClass mt-2'>
                            <img src='/resources/location.png' width={'20px'} className='me-2' ></img>
                            {userData.location}
                        </span>}
                        {userData.blog && <a href={userData.blog} target='_blank' className='infoItemClass mt-2'>
                            <img src='/resources/blog.png' width={'20px'} className='me-2' ></img>
                            {userData.blog}
                        </a>}
                        {userData.company && <span className='infoItemClass mt-2'>
                            <img src='/resources/company.png' width={'20px'} className='me-2' ></img>
                            {userData.company}
                        </span>}
                    </Row>
                </Col>
            </Row>
            <hr></hr>
            <Row>
                {userRepos &&
                    userRepos.length > 0
                    ? userRepos.map((repo) => renderRepo(repo))
                    : <ReposNotFound />}
            </Row>
        </div>
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
                    {usersList && usersList.length > 0 ? usersList.map((user) => renderUsersListItem(user)) : <UsersNotFound />}
                </Col>
                {isUserDetailOpen && <UserDetails />}
            </Row>
        </Container>
    )
}

export default DetailScreen;