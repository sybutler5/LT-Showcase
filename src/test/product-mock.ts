// invalid input (illegal chars?) nothing found displays error message
// no input for id 
// no input for keyword
// data changing format?



export const SINGLE_PRODUCT_RESULT = {
    'id': 1,
    'title': 'phone',
    'description': 'is a phone',
    'price': 100,
    'discountPercentage': 5,
    'rating': 1,
    'stock': 100,
    'brand': 'company',
    'category': 'phones',
    'thumbnail': 'thumbnail image',
    'images': [
        'image 1',
        'image 2'
    ]
}

export const MULTIPLE_PRODUCT_RESULT = {
    'products': [
        {
            'id': 1,
            'title': 'phone',
            'description': 'is a phone',
            'price': 100,
            'discountPercentage': 5,
            'rating': 1,
            'stock': 100,
            'brand': 'company',
            'category': 'phones',
            'thumbnail': 'thumbnail image',
            'images': [
                'image 1',
                'image 2'
            ]
        },
        {
            'id': 2,
            'title': 'also phone',
            'description': 'is a phone, too',
            'price': 125,
            'discountPercentage': 8,
            'rating': 5,
            'stock': 50,
            'brand': 'company',
            'category': 'phones',
            'thumbnail': 'thumbnail image',
            'images': [
                'image 3',
                'image 4'
            ]
        } 
    ]
}
