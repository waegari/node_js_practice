let postId = 1; // init value

// posts array shoki data
const posts = [
    {
        id: 1,
        title: '제목',
        body: '내용',
    },
];

/* 포스트 작성
POST /api/posts
{ title, body }
*/
exports.write = ctx => {
    // REST API의 Request body는 ctx.request.body에서 조회 가능
    const { title, body } = ctx.request.body;
    postId += 1;
    const post = { id: postId, title, body };
    posts.push(post);
    ctx.body = post;
};

/* 포스트 목록 조회
GET /api/posts
*/
exports.list = ctx => {
    ctx.body = posts;
}

/* 특정 포스트 조회
GET /api/posts/:id
*/
exports.read = ctx => {
    const { id } = ctx.params;
    // 주어진 id로 포스트 조회
    // 파라미터로 받아온 값은 String이므로 int로 변환할 필요 있음
    const post = posts.find(p => p.id.toString() === id);
    // 포스트 없을 때는 오류 반환
    if (!post) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.',
        };
        return;
    }
    ctx.body = post;
};

/* 특정 포스트 제거
DELETE /api/posts/:id
*/
exports.remove = ctx => {
    const { id } = ctx.params;
    // index 조회
    const index = posts.findIndex(p => p.id.toString() === id);
    // post가 없으면 오류 반환
    if (index === -1) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }
    // index번째 아이템 제거
    posts.slice(index, 1);
    ctx.status = 204; // no content
};

/* 포스트 수정(교체)
PUT /api/posts/:id
{ title, body }
*/
exports.replace = ctx => {
    // PUT method는 전체 포스트 정보를 입력해서 데이터를 통째로 교체할 때 사용
    const { id } = ctx.params;
    const index = posts.findIndex(p => p.id.toString() === id);
    if (index === -1) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }

    posts[index] = {
        id,
        ...ctx.request.body,
    };
    ctx.body = posts[index];
};

/*수정 (특정 필드만 변경)
PATCH /api/posts/:id
{ title, body }
*/
exports.update = ctx => {
    const { id } = ctx.params;
    const index = posts.findIndex(p => p.id.toString() === id);
    if (index === -1) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }
    posts[index] = {
        ...posts[index],
        ...ctx.request.body,
    };
    ctx.body = posts[index];
};