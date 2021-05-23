const base_api_path = `${window.location.origin}/`;
const user_api_path = base_api_path + 'user/';
const room_api_path = base_api_path + 'room/';
const request_api_path = base_api_path + 'request/';

const socket = io();
const WrongPassword = 'Wrong_password',
    NameIsTaken = 'Name_is_taken',
    BadRequest = 'Bad Request',
    NotFound = 'Not Found',
    OK = 'OK',
    AppError = 'Application_Error',
    ValidationDataError = 'Validation_error';

let currentRoom, currentRoomPassword, currentUser;

socket.on('Update full info', _ => {
    setTimeout( _ => loadMainPageInfo(),500);
})

function TryLogin() {
    fetch(base_api_path + 'connect',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    username: document.getElementsByName('USER_NAME')[0].value,
                    password: document.getElementsByName('USER_PASS')[0].value
                }
            )
        })
        .then(response => response.text())
        .then(view => {
                switch (view) {
                    case BadRequest:
                        PutContentInBlock('showerror', 'Check fields');
                        break;
                    case 'Unauthorized':
                        PutContentInBlock('showerror', 'Name is taken');
                        break;
                    default:
                        currentUser = document.getElementsByName('USER_NAME')[0].value;
                        PutContentInMainBlock(view);
                }
            }
        );
}

function ChangeRoom() {
    window.location = '/';
}

function LeaveRoom() {
    fetch(room_api_path + 'leave',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    ROOM_NAME: currentRoom,
                    USER_NAME: currentUser
                }
            )
        });
    window.location = '/';
}

function Logout() {
    window.location = '/logout';
}

function TryConnectRoom() {
    let roomName = (typeof document.getElementsByName('ROOM_NAME')[0] !== 'undefined') ?
        document.getElementsByName('ROOM_NAME')[0].value : currentRoom;
    let roomPass = (typeof document.getElementsByName('ROOM_PASS')[0] !== 'undefined') ?
        document.getElementsByName('ROOM_PASS')[0].value : currentRoomPassword;
    fetch(room_api_path + 'connect',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    ROOM_NAME: roomName,
                    ROOM_PASS: roomPass
                }
            )
        })
        .then(response => response.text())
        .then(view => {
                switch (view) {
                    case BadRequest:
                        PutContentInBlock('showerror', 'Check fields');
                        break;
                    case 'Unauthorized':
                        PutContentInBlock('showerror', 'WTF');
                        break;
                    case WrongPassword:
                        PutContentInBlock('showerror', 'Wrong password');
                        break;
                    default:
                        currentRoom = roomName;
                        currentRoomPassword = roomPass;
                        PutContentInMainBlock(view);
                        loadMainPageInfo();
                }
            }
        );
}

function CreateNewBill() {
    let body = [];
    let requests = document.getElementsByClassName('split_member');
    let current_sum = 0;
    let valid = true;
    let amount = document.getElementById('bill_amount').value;
    let comment = document.getElementById('comment').value;

    for (let i = 0; i < requests.length; i++) {
        let element = requests[i];
        current_sum += (parseInt(element.value * 100)) / 100;
        if ((parseInt(element.value * 100)) / 100 < 0) {
            valid = false;
            break;
        }
        if ((parseInt(element.value * 100)) / 100 != 0) {
            body.push({USER_FROM: element.name, COMMENT: comment, AMOUNT: (parseInt(element.value * 100)) / 100})
        }
    }

    if (1 * amount > current_sum) {
        valid = false;
    }

    if (!valid) {
        PutContentInBlock('showerror', 'Check input fields');
        return;
    }

    fetch(request_api_path + 'create',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                body
            )
        })
        .then(response => response.text())
        .then(view => {
                switch (view) {
                    case BadRequest:
                        PutContentInBlock('showerror', 'Check fields');
                        break;
                    case 'Unauthorized':
                        PutContentInBlock('showerror', 'WTF');
                        break;
                    case WrongPassword:
                        PutContentInBlock('showerror', 'Wrong password');
                        break;
                    case ValidationDataError:
                        PutContentInBlock('showerror', 'Check input fields');
                        break;
                    default:
                        TryConnectRoom();
                        socket.emit('update', 'Update full info');
                }
            }
        );
}

function ChangeRequest(user_to, user_from, comment) {
    let amount = document.getElementsByClassName('new_value_' + user_to + user_from + comment)[0].value;
    let valid = true;

    amount = (parseInt(amount * 100)) / 100;

    if (amount < 0) {
        valid = false;
    }

    if (!valid) {
        PutContentInBlock('showerror', 'Check input field');
        setTimeout(_ => {
            PutContentInBlock('showerror', '');
        }, 2000)
        return;
    }

    fetch(request_api_path + 'update',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    USER_FROM: user_from,
                    USER_TO: user_to,
                    COMMENT: comment,
                    AMOUNT: amount,
                }
            )
        })
        .then(response => {
            socket.emit('update', 'Update full info');
        });
}

function OpenNewBillPage() {
    fetch(base_api_path + 'newBill',
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            body: null
        })
        .then(response => response.text())
        .then(view => {
                switch (view) {
                    case BadRequest:
                        PutContentInBlock('showerror', 'Check fields');
                        break;
                    case 'Unauthorized':
                        PutContentInBlock('showerror', 'WTF');
                        break;
                    case WrongPassword:
                        PutContentInBlock('showerror', 'Wrong password');
                        break;
                    default:
                        PutContentInMainBlock(view);
                        loadTeamMembersForSplitting();
                }
            }
        );
}

function loadTeamMembersForSplitting() {
    fetch(room_api_path + 'userlist',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ROOM_NAME: currentRoom})
        })
        .then((response) => {
            return response.json();
        })
        .then((membersArray) => {
            let res = '<table>' +
                '<thead>' +
                '<tr><td>Name</td><td>Amount</td></tr>' +
                '</thead>' +
                '<tbody>'
            ;
            for (let member of membersArray) {
                let partOfBill = `<input type="number" pattern="^\d*(\.\d{0,2})?$" step=".01" name="${member}" class="split_member" value="0" />`
                res += `
                    <tr>
                        <td>
                        ${member}
                        </td>
                        <td>
                        ${partOfBill}
                        </td>
                    </tr>`
            }
            res += '</tbody></table>';
            PutContentInBlock('bill_split', res);
        });
}

function loadMainPageInfo() {
    LoadCurrentUser();
    LoadRoomMembers();
    LoadRequestsFrom();
    LoadRequestsTo();
    LoadUserDebts();
}

function LoadRoomMembers() {
    fetch(room_api_path + 'userlist',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ROOM_NAME: currentRoom})
        })
        .then((response) => {
            return response.json();
        })
        .then((membersArray) => {
            let res = '';
            for (let member of membersArray) {
                if (member === currentUser)
                    res += `<li><span class="current_user">${member}</span></li>`
                else
                    res += `<li><span>${member}</span></li>`;
            }
            PutContentInBlock('room_members', res)
        });
}

function LoadRequestsTo() {
    fetch(request_api_path + 'requeststo',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: null
        })
        .then((response) => {
            return response.json();
        })
        .then((requestsArray) => {
                let res = '';
                for (let request of requestsArray) {
                    let button1 = `<input class="button green alt" title="Accept" type="button" value="&#10003;" onClick="AcceptRequest(
                            '${request.USER_TO}','${request.USER_FROM}','${request.AMOUNT}','${request.COMMENT}')" />`;
                    let button2 = `<input class="button red alt" title="Edit" type="button" value="&#177;" onClick="ChangeRequest(
                            '${request.USER_TO}','${request.USER_FROM}','${request.COMMENT}')" />`;
                    res += `
                    <tr>
                        <td>${request.USER_FROM}</td>
                        <td class="mw-30"><input type="number" class="new_value_${request.USER_TO + request.USER_FROM + request.COMMENT}" placeholder="New amount" value="${request.AMOUNT}"/></td>
                        <td>${request.COMMENT}</td>
                        <td class="row">${button1}${button2}</td>
                    </tr>`
                }
                if (!requestsArray.length) {
                    res += `
                    <tr>
                        <td colspan="4">Empty</td>
                    </tr>`;
                }
                PutContentInBlock('requests_to_me', res)
            }
        );
}

function LoadRequestsFrom() {
    fetch(request_api_path + 'requestsfrom',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: null
        })
        .then((response) => {
            return response.json();
        })
        .then((requestsArray) => {
            let res = '';
            for (let request of requestsArray) {
                res += `
                    <tr>
                        <td>${request.USER_TO}</td>
                        <td>${request.AMOUNT}</td>
                        <td>${request.COMMENT}</td>
                    </tr>`;
            }
            if (!requestsArray.length) {
                res += `
                    <tr>
                        <td colspan="3">Empty</td>
                    </tr>`;
            }
            PutContentInBlock('requests_from_me', res)
        });
}

function LoadUserDebts() {
    fetch(request_api_path + 'debts',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: null
        })
        .then((response) => {
            return response.json();
        })
        .then((debts) => {
            PutContentInBlock('user_debts', debts)
        });
}

function LoadCurrentUser() {
    fetch(user_api_path + 'currentuser',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            return response.json();
        })
        .then((user) => {
            if (user !== null) {
                currentUser = user;
            }
        })
}

function AcceptRequest(user_to, user_from, amount, comment) {
    fetch(request_api_path + 'accept',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    USER_TO: user_to,
                    USER_FROM: user_from,
                    AMOUNT: amount,
                    COMMENT: comment,
                })
        })
        .then((response) => {
            return response.json();
        })
        .then((responseStatus) => {
            if (responseStatus == OK) {
                LoadRequestsTo();
                socket.emit('update', 'Update full info');
                setTimeout(()=> LoadRequestsTo(),200)
            } else {
                PutContentInBlock('critical_error', responseStatus)
            }
        });
}

function PutContentInMainBlock(content) {
    document.getElementById('content').innerHTML = content;
}

function PutContentInBlock(blockId, content) {
    document.getElementById(blockId).innerHTML = content
}



window.onload = () => {
    fetch(base_api_path + 'login', {method: 'GET'})
        .then(response => response.text())
        .then(view => {
            PutContentInMainBlock(view);
        });
}
