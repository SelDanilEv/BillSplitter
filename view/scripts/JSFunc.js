const base_api_path = `${window.location.origin}/`;
const user_api_path = base_api_path + 'user/';
const room_api_path = base_api_path + 'room/';
const request_api_path = base_api_path + 'request/';

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
                        PutContentInMainBlock(view);
                }
            }
        );
}
function TryConnectRoom() {
    fetch(room_api_path + 'connect',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    ROOM_NAME: document.getElementsByName('ROOM_NAME')[0].value,
                    ROOM_PASS: document.getElementsByName('ROOM_PASS')[0].value
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
                        PutContentInMainBlock(view);
                }
            }
        );
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
