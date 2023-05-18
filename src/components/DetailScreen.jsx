import React, { useContext, useEffect, useState } from 'react'
import { CloseButton, Col, Container, Image, Row, Stack } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import OctoCatNoUsers from "../resources/octocat_noUsers.png";
import OctoCatNoRepos from "../resources/octocat_noRepos.png";

const formatDate = (date) => {
    let res = 'Updated on'
    if (date) {
        let parsedDateArray = new Date(date).toDateString().split(' ');
        res = `${res} ${parsedDateArray.slice(1, 3)}, ${parsedDateArray[3]}`
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

    const UsersNotFound = () => {
        return <Stack direction='vertical'>
            <img src={OctoCatNoUsers} alt="Github OctoCat" style={{ "width" : "20em"}} width={"240px"} />
            <div style={{ color: 'whitesmoke' }} >Users not found</div>
        </Stack>
    }

    const ReposNotFound = () => {
        return <Stack direction='vertical'>
            <img src={OctoCatNoRepos} alt="Github OctoCat" style={{ "width" : "20em"}} width={"240px"} />
            <div style={{ color: 'whitesmoke' }} >Repos not found</div>
        </Stack>
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
            <span className='RepoHeaderTitle'>Repositories ({userRepos.length > 0 ? userRepos.length : 0})</span>
            <Row>
                {userRepos &&
                    userRepos.length > 0
                    ? userRepos.map((repo) => renderRepo(repo))
                    : <ReposNotFound />}
            </Row>
        </div>
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
                    <a className='userLinks' onClick={(e) => fetchUserData(user.login)} >More Details</a>
                </Stack>
            </Stack>
        </Stack>
    }

    const renderRepo = (userRepo) => {
        return <>
            <Stack key={userRepo.id} className="repoListItem" direction='vertical'>
                <a href={userRepo.html_url} target='_blank'>{userRepo.full_name}</a>
                <span className='repoDescpClass'>{userRepo.description ?? '  '}</span>
                <Stack className='repoInfoItems' direction='horizontal'>
                    {userRepo.language && <span className='repoInfoItemClass me-3'>
                        <img src='/resources/lang.png' width={'18px'} className='me-2' ></img>
                        {userRepo.language}
                    </span>}
                    {/* {userRepo.stargazers_count && <div className='vr' ></div>} */}
                    {userRepo.stargazers_count > 0 && <span className='repoInfoItemClass me-3'>
                        <img src='/resources/star.png' width={'16px'} className='me-2' ></img>
                        {userRepo.stargazers_count}
                    </span>}
                    {/* {userRepo.watchers_count && <div className='vr' ></div>} */}
                    {userRepo.watchers_count > 0 && <span className='repoInfoItemClass me-3'>
                        <img src='/resources/eye.png' width={'16px'} className='me-2' ></img>
                        {userRepo.watchers_count}
                    </span>}
                    {/* {userRepo.license && <div className='vr' ></div>} */}
                    {userRepo.license && <a href={userRepo.license?.url} target='_blank' className='repoInfoItemClass me-3'>
                        <img src='/resources/license.png' width={'20px'} className='me-2' ></img>
                        {userRepo.license?.name}
                    </a>}
                </Stack>
                {userRepo.updated_at && <span className='repoUpdatedByClass'>
                    {formatDate(userRepo.updated_at)}
                </span>}
            </Stack>

            {/* <hr></hr> */}
        </>
    }

    useEffect(() => {
        // console.log(location, searchQuery);
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