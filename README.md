# Use APIs

    - use: npm run start:dev

1.  **Auth**

    ### signup

        - url: localhost:2000/api/user/signup
        - method: POST
        - data:
        `
            {
                "name": "admin",
                "role": "admin",
                "email": "admin@admin.com",
                "password":"123456",
                "passwordConfirm":"123456"
            }
        `

    ### signin

        - url: localhost:2000/api/user/signin
        - method: POST
        - data:
        `
            {
                "email": "admin1@admin.com",
                "password":"123456"
            }
        `

    ### get user profile

        - url: localhost:2000/api/user/profile
        - method: GET
        - need sigin require

    ### get admin profile

        - url: localhost:2000/api/user/profile/admin
        - method: GET
        - need sigin require

2.  **Blogs**

    ### create a blog

        - url: localhost:2000/api/blog/create
        - method: POST
        - data:
        - need sigin require

    ### get all blogs

        - url: localhost:2000/api/blog
        - method: GET

    ### get a blog with slug

        - url: localhost:2000/api/blog/*test-blog-ccc*
        - method: GET

    ### get a blog with category slug

        - url: localhost:2000/api/blog/category/*apply-category*
        - method: GET

    ### get a blog with tag slug

        - url: localhost:2000/api/blog/tag/*react*
        - method: GET

    ### update blog with blog id

        - url: localhost:2000/api/blog/*600ee6e2d27a6e13d0ff6ed7*
        - method: PATCH
        - need sigin require

    ### delete blog with blog id

        - url: localhost:2000/api/blog/*600ee6e2d27a6e13d0ff6ed7*
        - method: DELETE
        - need sigin require

3.  **Categories**

    ### create category

        - url: localhost:2000/api/category/create
        - method: POST
        - data:
        `
            {
                "name": "new arrival"
            }
        `
        - need sigin require

    ### update category

        - url: localhost:2000/api/category/60099adef6c9642878e2895b
        - method: PATCH
        - data:
        `
            {
                "name": "new arrival"
            }
        `
        - need sigin require

    ### get categories

        - url: localhost:2000/api/category
        - method: GET

    4. **Tags**

    ### create tag

        - url: localhost:2000/api/tag/create
        - method: POST
        - data:
        `
            {
                "name": "react"
            }
        `
        - need sigin require

    ### update tag

        - url: localhost:2000/api/tag/60099adef6c9642878e2895b
        - method: PATCH
        - data:
        `
            {
                "name": "reacts"
            }
        `
        - need sigin require

    ### get tags

        - url: localhost:2000/api/tag
        - method: GET

4.  **initial data**

    ### get initial data

        - url: localhost:2000/api/initialData
        - method: GET
